# -*- coding:utf-8 -*-
__author__ = 'zhwx'

from twisted.internet import reactor
from core.protocol.tcp import TCPFactory, TCPProtocolTransfer
from . import ServiceBase
from core.logger import log

class CommonService(ServiceBase):
    """
        通用的TCP服务，对外提供一个端口
    """
    settings_section_name = "common"
    port = 8070  # 默认端口

    def startService(self):
        self.tcpservice = reactor.listenTCP(long(self.settings.get("port", self.port)), CommonTCPFactory())
        super(CommonService, self).startService()

    def stopService(self):
        self.tcpservice.stopListening()
        super(CommonService, self).stopService()

class CommonTCPFactory(TCPFactory):
    def buildProtocol(self, addr):
        log.debug("Connect form %s ." %  addr)
        return CommonTCPProtocolTransfer(self,addr)

class CommonTCPProtocolTransfer(TCPProtocolTransfer):
    def connectionMade(self):
        # self.factory.connects[self.peer.id]=self
        if self.keep_alive:
            try:
                self.transport.setTcpKeepAlive(1)
                log.debug("TCP connect <%s> KeepAlive is enabled." % str(self.peer))
            except AttributeError:
                pass

class UdpTest(ServiceBase):
    """
        少志要的udp测试，紧收到回复ok
    """
    port = 34783

    def startService(self):
        self.udptest = reactor.listenUDP(self.port, UpdTestFactory())

    def stopService(self):
        self.udptest.stopListening()
        return True

from twisted.internet.protocol import DatagramProtocol
class UpdTestFactory(DatagramProtocol):
    def datagramReceived(self, data, (host, port)):
        print "少志UDP测试，received %r from %s:%d" % (data, host, port)
        self.transport.write("OK", (host, port))