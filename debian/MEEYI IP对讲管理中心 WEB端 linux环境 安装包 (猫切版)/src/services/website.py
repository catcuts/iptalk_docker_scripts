# -*- coding:utf-8 -*-
__author__ = 'zhwx'
from twisted.internet import reactor
from web.site import SmartTalkWebSite
from . import ServiceBase

class WebSiteService(ServiceBase):
    """
        Web侦听服务
    """
    port=8071

    def startService(self):
        self.webtcp = reactor.listenTCP(self.port, SmartTalkWebSite())

    def stopService(self):
        self.webtcp.stopListening()
        return True
