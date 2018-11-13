# -*- coding:utf-8 -*-
"""
    本模块用来提供RPC服务

"""
__author__ = 'zhwx'
from twisted.internet import reactor
from core.protocol.tcp import TCPFactory
from . import ServiceBase
#
# class RPCService(ServiceBase):
#     """
#         IPTalk侦听服务
#     """
#     settings_section_name = "rpc"
#     port=8077
#     def startService(self):
#         self.tcp = reactor.listenTCP(self.port, TCPFactory())
#
#     def stopService(self):
#         self.tcp.stopListening()
#         return True
