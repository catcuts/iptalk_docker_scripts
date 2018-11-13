# -*- coding:utf-8 -*-
import uuid
import datetime
import json
import struct
from core.protocol.tcp import TCPFactory
from twisted.protocols.basic import LineReceiver
from twisted.internet.protocol import ClientCreator
from twisted.internet import reactor
from core.logger import log
from core.protocol.base import PeerInfo
from devices.iptalk.protocol import online_clients, CLIENT_TIME_OUT, DeviceState, SettingProtocol
from devices.iptalk.feature import PROTOCOL_QUERY_HEAD_FLAG
from devices.iptalk.util import to_wchar, charsToLong, closeDeviceConnect
from hprose import HproseService
from devices.iptalk.language import language as _


class RpcProtocolTransfer(LineReceiver, HproseService):
    keep_alive = True

    def __init__(self, factory):
        super(RpcProtocolTransfer, self).__init__()
        self._peer = None
        self.setRawMode()
        self.factory = factory
        self.addFunction(self.get_device_state)  # 查询设备状态
        self.addFunction(self.force_call)  # 强呼

    @property
    def peer(self):
        """
            记录客户端信息
        """
        if self._peer is None:
            client = self.transport.getHost()
            self._peer = PeerInfo(host=client.host, port=client.port, id=uuid.uuid4().hex)
        return self._peer

    def connectionMade(self):
        self.factory.connects[self.peer.id] = self
        if self.keep_alive:
            try:
                self.transport.setTcpKeepAlive(1)
                log.debug("TCP connect <%s> KeepAlive is enabled." % self.peer)
            except AttributeError:
                pass

    def dataReceived(self, data):
        re_data = self.handle(data)

    def rawDataReceived(self, data):
        pass

    def lineReceived(self, line):
        pass

    def send_data(self, data, pack=False):
        """
        发送rpc数据，目前只支持字符串(json)
        :param data:
        :return:
        """
        if pack:
            head = "R"
            tag = None
            body = data
            end = "\"z"
            if isinstance(data, str):  # 字符串
                tag = "s" + str(len(data)) + "\""
            if tag is not None:
                self.transport.write(head + tag + body + end)
        else:
            self.transport.write(data)

    def handle(self, environ):
        context = self._doFunctionList(environ)
        data = self._handle(environ, context)
        if data != "Rnz":
            self.send_data(data)

    def get_device_state(self, data):
        reply = data.split(";")
        string = ""
        for r in reply:
            r = r.split(",")[0]
            r = charsToLong(r)
            if r is not None:
                string += self._getDeviceState(r)
        return string

    def force_call(self, call_id, called_id):
        """
        强呼
        :param call_id:主叫
        :param called_id:被叫
        :return:
        """

        def deferCallbcak(p, msg):
            p.sendData(msg)

        call_id = charsToLong(call_id)
        called_id = charsToLong(called_id)
        if call_id not in online_clients:
            return _("设备") + str(call_id) + _("不在线")
        if called_id not in online_clients:
            return _("设备") + str(called_id) + _("不在线")
        call_host = online_clients[call_id].transfer.transport.getPeer().host
        call_msg = struct.pack("4i64s64s2i", PROTOCOL_QUERY_HEAD_FLAG, 0x2016, 136, 0, to_wchar(call_id),
                               to_wchar(called_id), 0, 5)
        creator = ClientCreator(reactor, SettingProtocol)
        d = creator.connectTCP(call_host, SettingProtocol.port)
        d.addCallback(deferCallbcak, call_msg)  # 可能存在无法连接设备的情况,暂不处理
        return _("呼叫已发送")

    def _getDeviceState(self, device_id):
        """
        获得设备状态
        @param device_id:设备id
        @return:
        """
        if device_id in online_clients:
            if (datetime.datetime.now() - online_clients[device_id].last_time).seconds < CLIENT_TIME_OUT:
                return online_clients[device_id].get_state()
            else:
                closeDeviceConnect(device_id)
        return DeviceState(device_id, 0, 0, 0, None, None).get_state()  # 不在线


class RpcFactory(TCPFactory):
    debug = True
    port = 35055  # 侦听端口
    connects = {}  # 保存客户端连接

    def startFactory(self):
        pass

    def buildProtocol(self, addr):
        log.debug("Connect form %s ." % addr)
        return RpcProtocolTransfer(self)
