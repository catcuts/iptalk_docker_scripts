# -*- coding:utf-8 -*-
__author__ = 'zhwx'

from twisted.application import service
from core import SmartTalkTCPService

#创建SmartTalk IoTService主应用
application  = service.Application("SmartTalk IoTService Application")

#TCP通信网关服务
TCPService = SmartTalkTCPService()
TCPService.setServiceParent(SmartTalkApplication)



