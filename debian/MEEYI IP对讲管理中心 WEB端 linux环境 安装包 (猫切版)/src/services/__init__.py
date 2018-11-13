# -*- coding:utf-8 -*-
__author__ = 'zhwx'
from settings import Settings
from twisted.application import service
from utils.importutil import import_object
import os
import glob


class ServiceBase(service.Service,object):
    """
    IoT Service服务
    """
    enabled=True
    settings={}         #服务配置参数，记录在ini文件中，ini段名称约定为[services] --> [common],[iptalk]
    settings_section_name= ""
    def __init__(self):
        #从配置文件读取服务运行参数
        self.settings_section_name=self.settings_section_name or self.__class__.__name__.lower()
        self.settings.update(Settings.get("services", self.settings_section_name,default={}))

class ServiceManagerBase(object):
    """
        加载IoT服务提供的服务
        服务应是一个Twisted Service类实现
    """
    services = []

    def __init__(self):
        self.discover_services()

    def discover_services(self):
        """
        发现所有在services里面的服务
        """
        self.services=[]
        for moudle in glob.glob(os.path.join(os.path.abspath(os.path.dirname(__file__)),"*.py")):
            if moudle not in ["__init__.py"]:
                try:
                    service_obj = import_object("services.%s" % os.path.basename(os.path.splitext(moudle)[0]))
                    for member in service_obj.__dict__:
                        try:
                            member_attr = getattr(service_obj, member)
                            if service_obj.__name__ == member_attr.__module__:
                                if issubclass(member_attr, ServiceBase) and member_attr.enabled:
                                    self.services.append(member_attr())
                        except:
                            pass
                except:
                    pass

    def init(self, app):
        """
            开始各项服务
        """
        for service in self.services:
            service.setServiceParent(app)

ServiceManager=ServiceManagerBase()