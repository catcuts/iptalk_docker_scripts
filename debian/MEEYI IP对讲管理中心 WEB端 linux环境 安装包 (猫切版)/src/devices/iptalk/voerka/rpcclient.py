# -*- coding:utf-8 -*-
from hprose import HproseClient
from twisted.internet.protocol import Protocol


class HproseTCPClient(HproseClient):
    def __init__(self, protocol=None, uri=None):
        self._prorocol = protocol
        super(HproseTCPClient, self).__init__(uri)

    def _sendAndReceive(self, data):
        self._prorocol.send(data)
        return "Rnz"  # 返回None


class RpcProtocol(Protocol):
    port=35
    client = None
    callback = None

    def __init__(self):
        self.client = HproseTCPClient(protocol=self)

    def dataReceived(self, data):
        data = self.__doInput(data)
        if self.callback is not None and callable(self.callback):
            self.callback(data)

    def send(self, data):
        self.transport.write(data)

    def __doInput(self, string):  # 目前只处理字符串(json)
        if isinstance(string, str):
            length = len(string)
            buf = string[2:length - 1]  # 去掉头Rs和尾z
            buf = buf.split('"')
            return buf[1]

    def get_device_state(self, string, callback=None):
        self.client.get_device_state(string)
        self.callback = callback
