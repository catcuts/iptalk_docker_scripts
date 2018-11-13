# # -*- coding:utf-8 -*-
# __author__ = 'zhwx'
# from twisted.internet import reactor
# from devices.iptalk.factory import OrderFactory, QueryFactory, AudioFactory, VideoFactory, WebSocketFactory, \
#     SearchFactory
# # from devices.iptalk.rpc import RpcFactory
# from web.site import SmartTalkWebSite
# from . import ServiceBase
#
#
# class IPTalkService(ServiceBase):
#     """
#         IPTalk侦听服务
#     """
#
#     def startService(self):
#         self.register_tcp = reactor.listenTCP(OrderFactory.port, OrderFactory())
#         self.query_tcp = reactor.listenTCP(QueryFactory.port, QueryFactory())
#         self.audio_udp = reactor.listenUDP(AudioFactory.port, AudioFactory())
#         self.video_udp = reactor.listenUDP(VideoFactory.port, VideoFactory())
#         # self.rpc_tcp = reactor.listenTCP(RpcFactory.port, RpcFactory())
#         self.web_tcp = reactor.listenTCP(85, SmartTalkWebSite())
#         self.web_socket = reactor.listenTCP(WebSocketFactory.port, WebSocketFactory())
#         self.search_tcp = reactor.listenMulticast(SearchFactory().port, SearchFactory(),
#                                                   listenMultiple=True)  # SearchFactory为单例模式
#
#     def stopService(self):
#         self.register_tcp.stopListening()
#         self.query_tcp.stopListening()
#         self.audio_udp.stopListening()
#         self.video_udp.stopListening()
#         # self.rpc_tcp.stopListening()
#         self.web_tcp.stopListening()
#         self.search_tcp.stopListening()
#         return True
