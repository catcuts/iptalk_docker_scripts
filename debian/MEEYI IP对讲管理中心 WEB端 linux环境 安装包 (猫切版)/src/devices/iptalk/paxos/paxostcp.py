# -*- coding:utf-8 -*-
import struct
from twisted.internet.protocol import Protocol, ServerFactory, connectionDone
from core.logger import log
from devices.iptalk.paxos import *


class PaxosTransfer(Protocol):
    server_id = None
    handler = None
    _tcp_buffer = ''

    def __init__(self, handler):
        self.handler = handler

    def dataReceived(self, data):
        log.info("rece %d" % (struct.unpack_from('I', data[8:12])[0]))
        try:  # 尝试拆包
            self._unpack(data)
        except Exception, e:
            if self._tcp_buffer is None:  # 包不完整，且前面没有缓存
                self._cutpack(data)  # 割肉
            else:  # 与之前缓存拼接
                data += self._tcp_buffer
                self._tcp_buffer = None
                try:  # 拼接后再次尝试拆包
                    self._unpack(data)
                except:  # 依旧异常
                    self._cutpack(data)  # 割肉

    def _unpack(self, data):
        flag, size = struct.unpack_from('2I', data[:8])
        length = len(data)
        if flag == PROTOCOL_PAXOS_HEAD_FLAG:
            if size == length:  # 正常包
                self._tcp_buffer = None  # 清空缓冲区
                try:
                    self.handler.data_received(self, data)
                except Exception, e:
                    import traceback
                    msg = traceback.format_exc()
                    print msg
                    log.error(e.message)
            elif size < length:  # 数据包过长
                log.warn('tcp pack exception:' + data.encode('hex').upper())
                data = self._partition(size, data)
                if len(data) > 0:  # 剩余部分
                    self._tcp_buffer = data
        else:
            raise PacketException()

    def _partition(self, size, data):
        length = len(data)
        while size <= length:
            log.warn('tcp partition pack:' + data[:size].encode('hex').upper())
            try:
                self.handler.data_received(self, data)
            except Exception, e:
                log.error(e.message)
            data = data[size:]
            length = len(data)
            if length > 0:
                try:
                    size = struct.unpack_from('I', data[4:8])[0]
                except:
                    break
            else:
                break
        return data

    def _cutpack(self, data):
        """
        切除无效数据，如果还有救的话，否则全部遗弃
        :param data: 实际数据包
        :return:
        """
        log.warn('tcp cutpack:' + data.encode('hex').upper())
        string = data.encode("hex").upper()
        try:
            # 找到第一个55665566的部分，切除前面无效数据
            num = string.find('66556655') / 2  # data:string=1:2
            data = data[num:]
            log.warn(('tcp cutedpack:' + data.encode('hex').upper()))
            self._unpack(data)  # 最后一次拆包
        except:  # 全部遗弃
            log.error('tcp drop pack:' + data.encode('hex').upper())

    def send_data(self, data):
        log.info("send %d" % (struct.unpack_from('I', data[8:12])[0]))
        self.transport.write(data)

    def connectionMade(self):
        self.transport.setTcpKeepAlive(1)

    def connectionLost(self, reason=connectionDone):
        # def deferCallbcak(p):
        #     self.handler.update_servers_connect(self.server_id, p)  # 重连成功，加入连接
        #
        # def re_connect(p=None, count=0):  # 重连
        #     if count < 3:  # 重连三次
        #         log.warn(('lose connect to %s(%s),%d times reconnection') % (self.server_id, host, count + 1))
        #         creator = ClientCreator(reactor, PaxosTransfer, self.handler)
        #         d = creator.connectTCP(host, port)
        #         d.addCallback(deferCallbcak).addErrback(re_connect, count + 1)
        #     else:
        #         log.warn(('lose connect to %s(%s),reconnect fail') % (self.server_id, host))
        #         self.handler.kill_server(self.server_id)
        #
        # host = self.transport.getPeer().host
        # port = self.transport.getPeer().port
        # log.warn(('lose connect to %s(%s)') % (self.server_id, host))
        # re_connect()
        self.handler.kill_server(self.server_id)

    def close(self):
        self.transport.loseConnection()


class PaxosFactory(ServerFactory):
    handler = None

    def __init__(self, handler):
        self.handler = handler

    def startFactory(self):
        pass

    def buildProtocol(self, addr):
        return PaxosTransfer(self.handler)

class PacketException(Exception):
    pass
