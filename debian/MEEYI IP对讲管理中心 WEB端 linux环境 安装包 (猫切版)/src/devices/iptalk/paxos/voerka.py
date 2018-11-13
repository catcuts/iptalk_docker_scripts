# -*- coding:utf-8 -*-
import struct
import json
from core.logger import log
from devices.iptalk.paxos import *
from devices.iptalk.protocol import online_clients

# head
DEVICE_ONLINE = 0x2001
DEVICE_OFFLINE = 0x2002
DEVICE_CALL = 0x2003
REQUEST_TOP = 0x2101
RESPONSE_TOP = 0x2102


class IPTalkHandler(PaxosHandler):
    devices = {}  # 共享数据
    session_id = 0  # 回话ID,配合callback_dict，用于处理回调及并发
    callback_dict = {}  # 回调字典，配合session_id,用于处理回调及并发

    def _init(self):  # 初始化数据
        self.devices = {}

    def start(self):
        self._init()
        PaxosHandler.start(self)

    def get_shared_resources(self):  # 子类实现
        return self.devices

    def login_success(self):  # 子类实现,登陆已经在线的设备
        if len(online_clients) > 0:  # 如果有设备已经登陆
            json_obj = online_clients.keys()
            json_str = json.dumps(json_obj)
            message = struct.pack('I32s' + str(len(json_str)) + 's', DEVICE_ONLINE, SERVER_ID, json_str)
            self.push_message(message)

    def set_shared_resources(self, shares):  # 子类实现
        self.devices = shares
        return True

    def delete_shared_resources(self, server_id):  # 子类实现
        if server_id in self.devices:
            del self.devices[server_id]
            return True
        return False

    def execute(self, data, protocol):  # 子类实现
        action, = struct.unpack_from('I', data[:4])
        if action == DEVICE_ONLINE:
            self._execute_device_online(data[4:], protocol)
        elif action == DEVICE_OFFLINE:
            self._execute_device_offline(data[4:], protocol)
        elif action == DEVICE_CALL:
            self._execute_device_call(data[4:], protocol)
        elif action == REQUEST_TOP:
            self._execute_request_top(data[4:], protocol)
        elif action == RESPONSE_TOP:
            self._execute_response_top(data[4:], protocol)

    def _get_session_id(self, count=1):
        self.session_id = (self.session_id + count) % 100000  # 循环使用
        return self.session_id

    @cut
    def device_online(self, device_id):
        message = struct.pack('I32sI', DEVICE_ONLINE, SERVER_ID, device_id)
        self.push_message(message)

    @cut
    def device_offline(self, device_id):
        message = struct.pack('I32sI', DEVICE_OFFLINE, SERVER_ID, device_id)
        self.push_message(message)

    @cut
    def device_call(self, from_device_id, to_device_id, data):
        for key, value in self.devices.items():  # 查看设备在哪个服务器
            if to_device_id in value:
                message = struct.pack('3I', DEVICE_CALL, from_device_id, to_device_id) + data
                self.send_message(message, server_id=key)
                return

    @cut
    def request_top(self, server_id, callback):
        session_id = self._get_session_id()
        message = struct.pack('II32s', REQUEST_TOP, session_id, server_id)
        self.callback_dict[session_id] = callback
        self.send_message(message, server_id=server_id)

    def _execute_device_online(self, data, protocol):  # 这里没有做冲突判断
        if len(data) == 36:  # 只有一台设备
            server_id, device_id = struct.unpack_from('32sI', data)
            server_id = self._cut_space(server_id)
        else:  # 多台设备
            length = len(data) - 32
            server_id, device_id = struct.unpack_from('32s' + str(length) + 's', data)
            server_id = self._cut_space(server_id)
            device_id = json.loads(device_id)
            device_id = unicode_string(device_id)  # 所有unicode转string
        if server_id not in self.devices:
            self.devices[server_id] = []
        if type(device_id) is list:  # 有可能是一堆设备
            for d_id in device_id:
                self._append_device(server_id, d_id)
        else:
            self._append_device(server_id, device_id)
            # print self.devices

    def _append_device(self, server_id, device_id):
        from devices.iptalk.util import deviceLoginPush
        if type(device_id) == int:
            device_id = long(device_id)
        self.devices[server_id].append(device_id)
        deviceLoginPush(device_id)

    def _execute_device_offline(self, data, protocol):
        from devices.iptalk.util import deviceLostPush
        server_id, device_id = struct.unpack_from('32sI', data)
        server_id = self._cut_space(server_id)
        if device_id in self.devices[server_id]:
            self.devices[server_id].remove(device_id)
        id = uuid.uuid4().hex
        deviceLostPush(id, device_id)
        # print self.devices

    def _execute_device_call(self, data, protocol):
        from_device_id, to_device_id = struct.unpack_from('2I', data[:8])
        log.info("%d call %d" % (from_device_id, to_device_id))
        data = data[8:]
        from devices.iptalk.protocol import IPTalkProtocol
        try:  # 测试用
            IPTalkProtocol(None).Request().call_handle(data)
        except Exception, e:
            import traceback
            msg = traceback.format_exc()
            print msg

    def _execute_request_top(self, data, protocol):
        def sqlCallback(data):
            json_str = json.dumps(data)
            command = '2I32s' + str(len(json_str)) + 's'
            message = struct.pack(command, RESPONSE_TOP, session_id, server_id, json_str)
            protocol.send_data(self._pack_message(messages=[message]))

        from devices.iptalk.protocol import db_manager
        session_id, server_id = struct.unpack_from('I32s', data)
        db_manager.getDeviceTreeChildrenByIdWithXml(id='custom', level=0, callback=sqlCallback)

    def _execute_response_top(self, data, protocol):
        command = 'I32s' + str(len(data) - 36) + 's'
        session_id, server_id, json_str = struct.unpack_from(command, data)
        top = json.loads(json_str)
        if session_id in self.callback_dict and callable(self.callback_dict[session_id]):
            server_id = self._cut_space(server_id)
            self.callback_dict[session_id](server_id, top)


iptalk_bus = IPTalkHandler()
