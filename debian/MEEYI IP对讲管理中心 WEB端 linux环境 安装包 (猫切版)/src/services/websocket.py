# -*- coding:utf-8 -*-
"""

  本模块用来为IoTService提供WebSocket支持
  开启本模块后，允许通过WebSocket直接访问IoT提供的服务

"""

__author__ = 'zhwx'
from . import ServiceBase
from twisted.internet import reactor
from web.websock import WebSocketServer

class WebSockService(ServiceBase):
    """
        开启设备服务站点
    """
    settings_section_name = "websocket"
    port = 8072  # 默认端口

    def startService(self):
        self.tcpservice = reactor.listenTCP(self.port, WebSocketServer)
        super(WebSockService, self).startService()

    def stopService(self):
        self.tcpservice.stopListening()
        super(WebSockService, self).stopService()