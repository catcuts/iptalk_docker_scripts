# -*- coding:utf-8 -*-
import json
import time
import struct
from twisted.internet import reactor
from twisted.internet.protocol import ClientCreator
from core.logger import log
from devices.iptalk.paxos import *


class PaxosHandler(object):
    is_login = False
    state = FREE
    ballots_id = 0  # 最新选举id,累加(理论上会一致)
    servers = {}  # 服务器数据(强制一致) server_id:{'server_ip':server_ip,'weight':0}
    # devices = {}  # 设备状态(强制一致)
    message_queue = []  # 消息队列
    servers_connect = {}  # 与其他服务器连接套接字 server_id:protocol
    current_ballots = None  # 当前进行中的选举,没有进行中的选举时为None
    balloting = False  # 是否处于接收投票中
    ballot_count = 0  # 收到的票
    ballot_agree_count = 0  # 收到的赞成票
    factory = None

    def _init(self):  # 初始化数据(预留方法)
        self.state = FREE
        self.ballots_id = 0
        self.servers = {}
        self.message_queue = []
        self.servers_connect = {}
        self.current_ballots = None
        self.balloting = False
        self.ballot_count = 0
        self.ballot_agree_count = 0
        if self.factory is None:
            self.factory = PaxosFactory(self)
            reactor.listenTCP(port, self.factory)  # 监听端口

    # 对外常用接口
    def start(self):
        if not START_VOERKA:
            return
        PaxosHandler._init(self)
        if TARGET_IP is None:  # 如果没有集群需要加入
            self.servers[SERVER_ID] = {'server_ip': SERVER_IP, 'weight': 0}  # 群主
            self._login_success(None, None)
        else:
            self._join_group()

    def send_message(self, message, server_id=None, protocol=None):  # 发送定向消息，无需同步
        data = self._pack_message(messages=[message])
        if server_id in self.servers and server_id in self.servers_connect:
            self.servers_connect[server_id].send_data(data)
        elif protocol is not None:
            protocol.send_data(data)

    def push_message(self, message, delay=True):  # 发送同步消息(重要消息)，delay=False(立刻发送)
        if len(self.servers) == 1:  # 如果服务器只有自己
            self.state = ROCK
            self._execute(message)
            self.state = FREE
        else:
            self.message_queue.append(message)  # 加入消息队列
            if self.state == FREE and delay is False:  # 状态空闲且需要立刻发送
                self._ballots()  # 立刻发起选举
            else:
                self._push_message_queue()  # 延迟发动选举

    def update_servers_connect(self, server_id, protocol):
        self.servers_connect[server_id] = protocol
        protocol.server_id = server_id

    # 工具方法
    def _pack_message(self, command=ORIENTATE, ballots_id=0, other=0, messages=[]):  # 命令，选举ID,预留字段，消息字符串数组
        if type(messages) is list:
            msg_str = ''
            for message in messages:
                msg_str = msg_str + message + ';;'  # 用;;作为消息分割
        else:
            msg_str = messages
        size = len(msg_str) + 20  # 算上包头5*4
        return struct.pack('5I', PROTOCOL_PAXOS_HEAD_FLAG, size, command, ballots_id, other) + msg_str

    def _push_message_queue(self):  # 发送一致性消息
        if len(self.message_queue) == 0:  # 如果没有任何数据需要发送
            return
        if len(self.servers) == 1:  # 如果服务器只有自己
            self.state = ROCK
            self._execute(None)
            del self.message_queue[:]  # 清空队列
            self.state = FREE
        else:
            if self.state == FREE:  # 状态空闲
                self._ballots()  # 发起选举
            else:
                reactor.callLater(BALLOTS_INTERVAL, self._push_message_queue)

    def _send_to_all(self, data):  # 发送消息给所有服务器
        for key in self.servers.keys():  # 获取所有服务器
            if key == SERVER_ID:  # 不用发给自己
                continue
            self.servers_connect[key].send_data(data)

    def _delete_server_info(self, server_id):  # 清除某个服务器的全部数据
        if server_id in self.servers:
            del self.servers[server_id]
        if server_id in self.servers_connect:
            self.servers_connect[server_id].close()
            del self.servers_connect[server_id]
        if server_id in self.get_shared_resources():
            self.delete_shared_resources(server_id)

    def _get_max_weight(self):  # 获取最大server的weight
        weight = 0
        for server in self.servers.values():
            if weight < server['weight']:
                weight = server['weight']
        return weight

    def _cut_space(self, string):
        string = string.replace('\0', '')
        if type(string) is unicode:
            string = string.encode("utf-8")
        return string

    # 选举相关
    def _ballots(self, retry=False):  # 发起选举
        self.state = WAIT  # 切换状态
        self.ballots_id += 1  # 累加
        self.balloting = True  # 开始接受投票
        self.ballot_count = 0  # 清0收到的票
        self.ballot_agree_count = 0  # 清0收到的赞成票
        current_time = time.time()
        self.current_ballots = {  # 修改状态
            'ballots_id': self.ballots_id,
            'ballots_server_id': SERVER_ID,
            'ballots_time': current_time,
            'is_retry': retry
        }
        message = struct.pack('32sI?', SERVER_ID, current_time, retry)
        data = self._pack_message(command=BALLOTS, ballots_id=self.ballots_id, messages=message)
        self._send_to_all(data)

    def _agree(self, protocol, ballots_id, ballots_server_id, ballots_time, is_retry):
        self.state == ROCK  # 修改状态
        self.current_ballots = {  # 修改状态
            'ballots_id': ballots_id,
            'ballots_server_id': ballots_server_id,
            'ballots_time': ballots_time,
            'is_retry': is_retry
        }
        message = struct.pack('32s', SERVER_ID)
        data = self._pack_message(command=AGREE, ballots_id=ballots_id, messages=message)
        protocol.send_data(data)

    def _disagree(self, protocol, ballots_id, ballots_server_id, ballots_time, is_retry):
        message = struct.pack('32s', SERVER_ID)
        data = self._pack_message(command=DISAGREE, ballots_id=ballots_id, messages=message)
        protocol.send_data(data)

    def _deal_conflicts(self, protocol, ballots_id, ballots_server_id, ballots_time, is_retry):
        if self.servers[ballots_server_id]['weight'] > self.servers[SERVER_ID]['weight']:  # 对方身份更高
            self._give_up_ballots(protocol, ballots_id, ballots_server_id, ballots_time, is_retry)  # 放弃选举
        else:
            pass  # 准备发起二次选举(这里什么都不用做)

    def _give_up_ballots(self, protocol, ballots_id, ballots_server_id, ballots_time, is_retry):  # 放弃选举
        self.balloting = False  # 不再接受投票
        self.ballot_count = 0  # 清0收到的票
        self.ballot_agree_count = 0  # 清0收到的赞成票
        self._agree(protocol, ballots_id, ballots_server_id, ballots_time, is_retry)  # 同意选举

    def _ballot_box(self, protocol, command):  # 投票箱
        if not self.balloting:  # 如果不在投票中
            return
        self.ballot_count += 1  # 总票数
        if command == AGREE:
            self.ballot_agree_count += 1  # 赞成票
        if self.ballot_count == len(self.servers) - 1:  # 投票完成,-1自己不算
            self.balloting = False  # 不再接受投票
            if self.ballot_count == self.ballot_agree_count:  # 所有人都投赞成票
                self._start()  # 开始更新状态
            else:
                self._ballots(retry=True)  # 发起二次选举

    def _start(self):
        self.state = ROCK  # 此时所有服务器都进入了ROCK状态
        data = self._pack_message(command=START, ballots_id=self.current_ballots['ballots_id'],
                                  messages=self.message_queue)
        self._send_to_all(data)
        self._execute(None)  # 执行任务
        del self.message_queue[:]  # 清空队列
        self.current_ballots = None  # 结束选举
        self.state = FREE

    def _end(self, protocol, data):
        re_data = self._pack_message(command=END, ballots_id=self.current_ballots['ballots_id'])
        protocol.send_data(re_data)
        self.ballots_id = self.current_ballots['ballots_id']  # 更新最新的选举编号
        self._execute(data)  # 执行任务
        self.current_ballots = None  # 结束选举
        self.state = FREE

    # 业务相关

    def data_received(self, protocol, data):  # 收到数据
        flag, size, command, ballots_id, other = struct.unpack_from('5I', data[:20])
        if command == BALLOTS:  # 接到他人发送的选举
            ballots_server_id, ballots_time, is_retry = struct.unpack_from('32sI?', data[20:])
            ballots_server_id = self._cut_space(ballots_server_id)
            if ballots_id < self.ballots_id:  # 如果选举过期就不同意选举，等于一般出现在高并发下同时发起选举，虽然过期，但依然要进行处理
                self._disagree(protocol, ballots_id, ballots_server_id, ballots_time, is_retry)
            elif self.state == FREE:  # 空闲就赞成选举
                self._agree(protocol, ballots_id, ballots_server_id, ballots_time, is_retry)
            elif self.state == WAIT:  # 正在发起另一个选举
                self._deal_conflicts(protocol, ballots_id, ballots_server_id, ballots_time, is_retry)  # 处理冲突
            else:  # self.state == ROCK
                if ballots_id == self.current_ballots['ballots_id'] and \
                                ballots_server_id == self.current_ballots['ballots_server_id'] \
                        or is_retry:  # 之前同意过的选举或二次选举强制同意
                    self._agree(protocol, ballots_id, ballots_server_id, ballots_time, is_retry)  # 同意
                else:
                    self._disagree(protocol, ballots_id, ballots_server_id, ballots_time, is_retry)  # 不同意，选举冲突
        elif command == AGREE or command == DISAGREE:  # 接收到同意或不同意
            self._ballot_box(protocol, command)  # 放入投票箱
        elif command == START:  # 开始任务
            self._end(protocol, data[20:])
        elif command == END:  # 结束任务
            pass  # (这里什么都不用做)
        elif command == ORIENTATE:  # 实时任务
            self._execute(data[20:], real_time=True, protocol=protocol)

    def _execute(self, data, real_time=False, protocol=None):
        if data is None:  # 执行本地消息队列
            content = self.message_queue
        else:  # 执行其他服务器消息队列
            content = data.split(';;')
        for data in content:
            if len(data) == 0:
                continue
            head, = struct.unpack_from('I', data[:4])
            log.info("action: %d" % (head))
            if head == LOGIN:  # 请求加入集群
                self._login(data[4:], protocol)
            elif head == ADD_SERVERS:  # 新的服务器加入
                self._add_servers(data[4:], protocol)
            elif head == LOGIN_SUCCESS:  # 加入集群成功
                self._login_success(data[4:], protocol)
            elif head == KILL_SERVERS:
                self._kill_servers(data[4:], protocol)
            else:
                self.execute(data, protocol)
        if not real_time and self.current_ballots and 'ballots_id' in self.current_ballots:  # 同步消息更新选举编号
            if self.current_ballots['ballots_id'] > self.ballots_id:  # 更新选举编号
                self.ballots_id = self.current_ballots['ballots_id']

    def _join_group(self):  # 加入集群
        def deferCallbcak(protocol):
            message = struct.pack('I32s16s', LOGIN, SERVER_ID, SERVER_IP)
            self.send_message(message, protocol=protocol)

        def connect():
            creator = ClientCreator(reactor, PaxosTransfer, self)
            d = creator.connectTCP(TARGET_IP, port)
            d.addCallback(deferCallbcak).addErrback(reconnect)

        def reconnect(protocol):
            reactor.callLater(RE_LOGIN_TIME, connect)
            log.warn(('unable to connect %s,it will re login in %d seconds') % (TARGET_IP, RE_LOGIN_TIME))

        connect()

    def _login(self, data, protocol=None):
        server_id, server_ip = struct.unpack_from('32s16s', data)
        server_id = self._cut_space(server_id)
        server_ip = self._cut_space(server_ip)
        if server_id not in self.servers:  # 服务器id不冲突
            weight = self._get_max_weight() + 1  # 新来的weight为集群中所有服务器weight中最大的再+1
            self.update_servers_connect(server_id, protocol)
            if len(self.servers) == 1:  # 集群中只有自己,直接添加,并回复消息
                self.servers[server_id] = {'server_ip': server_ip, 'weight': weight}
                self._reply_login(server_id)
            else:  # 发起选举
                message = struct.pack('I32s16sI', ADD_SERVERS, server_id, server_ip, weight)
                self.push_message(message, delay=False)

    def _add_servers(self, data, protocol):
        def deferCallbcak(p):
            self.update_servers_connect(server_id, p)
            message = struct.pack('I32s', LOGIN_SUCCESS, SERVER_ID)  # 告诉新人自己的id
            self.send_message(message, server_id=server_id)  # 告诉新人自己的id，给新人构建servers_connect

        server_id, server_ip, weight = struct.unpack_from('32s16sI', data)
        server_id = self._cut_space(server_id)
        server_ip = self._cut_space(server_ip)
        self.servers[server_id] = {'server_ip': server_ip, 'weight': weight}
        if server_id in self.servers_connect:  # 发起者的连接已存在,通知新人连接成功，并将最新的数据发给新人
            self._reply_login(server_id)
        else:  # 创建与新人的连接
            creator = ClientCreator(reactor, PaxosTransfer, self)
            d = creator.connectTCP(server_ip, port)
            d.addCallback(deferCallbcak)

    def _reply_login(self, server_id):  # 回复登陆者
        json_obj = {
            'servers': self.servers,
            'shares': self.get_shared_resources(),
            'ballots_id': self.ballots_id,  # 最新的选举id
        }
        json_str = json.dumps(json_obj)
        message = struct.pack('I32s' + str(len(json_str)) + 's', LOGIN_SUCCESS, SERVER_ID, json_str)  # 告诉新人所有共享数据及自己的id
        self.send_message(message, server_id=server_id)

    def _login_success(self, data, protocol):  # 如果bus只有自己，data=None,protocol=None
        if data is not None:
            length = len(data) - 32
            server_id, json_str = struct.unpack_from('32s' + str(length) + 's', data)
            server_id = self._cut_space(server_id)
            if protocol is not None:  # 保存protocol对象
                self.update_servers_connect(server_id, protocol)
            if json_str is not None and len(json_str) > 0:  # 来自群主的消息，包含了其他服务器的json信息
                item = json.loads(json_str)
                item = unicode_string(item)  # 所有unicode转string
                self.servers = item['servers']
                self.set_shared_resources(item['shares'])
                self.ballots_id = item['ballots_id']
        if len(self.servers) - 1 == len(self.servers_connect):  # 如果所有服务器的连接都建立完毕，这里判断条件还需要升级
            self.is_login = True
            self.login_success()

    def kill_server(self, server_id):  # 将某个服务器踢出集群
        if server_id in self.servers:  # 如果该服务器存在(有可能被其他服务器杀死)
            self._delete_server_info(server_id)
            if len(self.servers) <= 1:  # 如果服务器只剩自己，那就不用投票了,重启服务器
                self.start()
            else:  # 先删再杀，杀死对方不需要征求对方同意
                message = struct.pack('I32s', KILL_SERVERS, server_id)
                self.push_message(message, delay=False)  # 投票杀死对方

    def _kill_servers(self, data, protocol):
        server_id, = struct.unpack_from('32s', data)
        server_id = self._cut_space(server_id)
        for msg in self.message_queue:  # 检查自己的队列中是否有相同的操作，有就去掉(一般情况下，一台服务器掉线，所有服务器都能感知到，所以同样动作可能多人发动)
            action, = struct.unpack_from('I', msg[:4])
            if action == KILL_SERVERS:
                msg_server_id, = struct.unpack_from('32s', msg[4:])
                msg_server_id = self._cut_space(msg_server_id)
                if server_id == msg_server_id:
                    self.message_queue.remove(msg)
        self._delete_server_info(server_id)

    def get_shared_resources(self):  # 返回共享的数据，需要子类实现
        return {}

    def login_success(self):  # 登陆总线成功的回调，需要子类实现
        pass

    def set_shared_resources(self, shares):  # 修改共享数据，需要子类实现
        return True

    def delete_shared_resources(self, server_id):  # 删除某个服务器相关的共享数据，需要子类实现
        return True

    def execute(self, data, protocol):  # 执行相关功能，需要子类实现
        pass


paxos_handler = PaxosHandler()
