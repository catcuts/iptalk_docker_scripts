# -*- coding:utf-8 -*-
import time
from devices.iptalk.voerka.mqttclient import BROKER, MQTTService
from devices.iptalk.voerka.redis import Redis
from devices.iptalk.protocol import online_clients
from mqtt.client.factory import MQTTFactory
from twisted.internet import reactor
from twisted.internet.endpoints import clientFromString
from settings import Settings
from core.logger import log

is_connect = 'connect' in Settings.get('voerka') and Settings.get('voerka')['connect'] == 'true'
client_id = 'clientId' in Settings.get('voerka') and Settings.get('voerka')['clientId']
# redis
SERVER_HASH = 's_state'  # 服务器状态
DEVICE_SET = 'd_state'  # 设备状态
SERVER_PROPERTY_HASH = 's_property'  # 服务器属性
SERVER_DEVICES_SET = 's_d_' + client_id  # 服务器下的设备


def cut(cls):
    def _wrapper(c, *arg):
        if c.is_connect:
            cls(c, *arg)

    return _wrapper


class VoerkaClient(object):
    mqtt_service = None
    redis = None
    default_topics = ['iptalk/sys']  # 默认订阅iptalk系统级消息
    device_ids = set()  # 成功登陆voerka的设备id
    tcp_clients = {}

    def __init__(self):
        self.is_connect = is_connect

    @cut
    def start(self):
        log.info("starting Voerka Client")
        # mqtt
        factory = MQTTFactory(profile=MQTTFactory.PUBLISHER | MQTTFactory.SUBSCRIBER)
        myEndpoint = clientFromString(reactor, BROKER)
        self.mqtt_service = MQTTService(myEndpoint, factory, self.default_topics)
        self.mqtt_service.startService()
        # redis
        self.redis = Redis()
        self.redis.connect().addCallback(self._init)

    def _init(self):  # 初始化服务器数据至总线
        def _hgetallCallBack(d):  # d = server_id:time
            current_time = time.time()
            for k, v in d:
                if current_time - v <= 20:  # 服务器正常
                    server_list.append(k)
            self.redis.sunion(server_list).addCallback(_sunionCallBack)

        def _sunionCallBack(server_devices):  # s=set() 所有在线设备set的交集
            self_devices = set(online_clients.keys())
            self.device_ids = self_devices - server_devices
            self.redis.sadd(SERVER_DEVICES_SET, self.device_ids)

        server_list = []
        if len(online_clients) > 0:  # 优化：如果本地没有设备在线，跳过这个步骤
            self.redis.hgetall(SERVER_HASH).addCallback(_hgetallCallBack)  # 获取所有在线的服务器
        reactor.callLater(10, self.keep_alive)  # 保活

    @cut
    def keep_alive(self, r=None):  # 保活
        self.redis.hset(SERVER_HASH, client_id, time.time())  # 服务器保活
        self.redis.sadd(SERVER_DEVICES_SET, self.device_ids)  # 设备保活
        self.redis.expire(SERVER_DEVICES_SET, 20)  # 设置20秒有效期，超过自动销毁
        reactor.callLater(10, self.keep_alive)

    @cut
    def device_online(self, device_id, callback=None):
        """
        设备上线
        :param device_id: device_id
        """

        def _hgetallCallBack(d):  # d = server_id:time
            current_time = time.time()
            for k, v in d:
                if current_time - v <= 20:  # 服务器正常
                    server_list.append(k)
            self.redis.sunion(server_list).addCallback(_sunionCallBack)

        def _sunionCallBack(server_devices):  # s=set() 所有在线设备set的交集
            if device_id not in server_devices:  # 如果总线中没有这个设备
                self.redis.sadd(SERVER_DEVICES_SET, device_id)
                self.device_ids.add(device_id)

        server_list = []
        self.redis.hgetall(SERVER_HASH).addCallback(_hgetallCallBack)  # 获取所有在线的服务器

    @cut
    def device_offline(self, device_id, callback=None):
        self.redis.srem(SERVER_DEVICES_SET, device_id)
        self.device_ids.remove(device_id)

    def get_voerka_device_map(self, callback):
        """
        获取总线所有设备的id{'服务器id':['设备id','设备id']}
        """
        pass

    def send_call(self, protocol, from_device_id, to_device_id, data):
        def _hgetallCallBack(d):  # d = server_id:time
            current_time = time.time()
            for k, v in d:
                if current_time - v <= 20:  # 服务器正常
                    self.redis.sismember(k).addCallback(_sismember)  # 判断是否在这服务器

        def _sismember(b):  # 如果成员元素是集合的成员，返回 1。如果成员元素不是集合的成员，或 key 不存在，返回 0。
            if b == 1:
                # self.redis.
                pass

        if to_device_id in self.tcp_clients:  # 如果保存目标的连接
            self.tcp_clients[to_device_id].send_data(data)
        else:  # 去redis查询目标服务器ip地址
            self.redis.hgetall(SERVER_HASH).addCallback(_hgetallCallBack)  # 获取所有在线的服务器


voerka_client = VoerkaClient()
