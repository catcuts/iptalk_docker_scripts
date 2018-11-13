# -*- coding:utf-8 -*-

# try:
# 	import subprocess
# 	proc = subprocess.Popen("sudo ufw disable", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# 	print("ufw disabling: \t\nstdout: %s\t\nstderr: %s" % proc.communicate())
# except Exception as E:
# 	print("ufw disabling failed! %s" % E)
import sys
if sys.platform == "win32":
    from twisted.internet import iocpreactor  # ,select,poll,iocp,epoll
    iocpreactor.install()

from twisted.internet import reactor
from devices.iptalk.factory import OrderFactory, QueryFactory, AudioFactory, VideoFactory, WebSocketFactory, \
    SearchFactory, TCPPushFactory,SpeakerFactory,HuiFangAlarmFactory
# from devices.iptalk.voerka.rpcfactory import RpcFactory
from web.site import IPTalkWebSite
from devices.iptalk.paxos.voerka import iptalk_bus
from devices.iptalk.ftp import MyFTPFactory
from devices.iptalk.apiutil import getMsgObjFromQueue
from devices.iptalk.factory import IPTalkMonitor
from threading import Thread

from core.logger import log
from version import Version
Version = Version["iptalk"]
log.info("Starting SmartTalk IoTService.Version is " + Version)


# log.debug(str({1: 2}))
# 开启TCP服务器
reactor.listenTCP(OrderFactory.port, OrderFactory())
reactor.listenTCP(QueryFactory.port, QueryFactory())
reactor.listenTCP(SpeakerFactory.port, SpeakerFactory())
reactor.listenTCP(HuiFangAlarmFactory.port, HuiFangAlarmFactory())
reactor.listenUDP(AudioFactory.port, AudioFactory())
reactor.listenUDP(VideoFactory.port, VideoFactory())
# reactor.listenTCP(RpcFactory.port, RpcFactory())
# reactor.listenUDP(ForwardFactory.port, ForwardFactory())
reactor.listenTCP(85, IPTalkWebSite())
reactor.listenTCP(WebSocketFactory.port, WebSocketFactory())
reactor.listenTCP(TCPPushFactory.port, TCPPushFactory())
reactor.listenMulticast(SearchFactory().port, SearchFactory(), listenMultiple=True)  # SearchFactory为单例模式
iptalk_bus.start()
# ftp服务器
reactor.listenTCP(MyFTPFactory.port, MyFTPFactory())
# 子线程
reactor.callInThread(getMsgObjFromQueue)
# 开启监控
Thread(target=IPTalkMonitor().start).start()
# reactor.callInThread(IPTalkMonitor().start)
reactor.run()
