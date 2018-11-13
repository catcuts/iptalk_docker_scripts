# -*- coding:utf-8 -*-


__author__ = 'zhwx'
import functools
import inspect
import json
import os
import sys

import wrapt
from twisted.internet import threads
from twisted.python.filepath import FilePath
from twisted.web import static
from twisted.web.resource import Resource
from twisted.web.server import Site, NOT_DONE_YET
from twisted.web.template import Element, renderer, XMLFile, flattenString

from utils.importutil import import_object
# from .weixin import DeviceWeiXinSite
# from txroutes import Dispatcher
from devices.iptalk.const import FTP_REC_ROOT

def webpage(wrapped=None, url=None, content_type="html", template=None, async=False):
    """
    用来在DeviceSiteBase里装饰web访问方法
    @param url:指明方法所对应的url地址
    @param type:指明响应的数据类型，取值html,json
    @param template:该方法采采用的模板文件名称，启用模板时，该方法需要返回一个字典，用来填充模板
    @param async:是否异步执行该方法
    @return:
    """
    if wrapped is None:
        return functools.partial(webpage, url=url, content_type=content_type, template=template, async=async)

    @wrapt.decorator
    def _webpage(wrapped, instance, args, kwargs):
        return wrapped(*args, **kwargs)

    func = _webpage(wrapped)
    func.ispage = True
    func.url = wrapped.__name__ if url is None else url[1:] if url.startswith("/") else url
    func.content_type = content_type
    func.template = template
    func.async = async  # 异步调用
    return func


class DevicePageTemplate(Element):
    def __init__(self, loader=None, context={}):
        Element.__init__(self, loader)
        self.context = context

    @renderer
    def body(self, request, tag):
        tag.fillSlots(**self.context)
        return tag

    @renderer
    def head(self, request, tag):
        tag.fillSlots(**self.context)
        return tag


class DevicePage(Resource):
    def __init__(self, device_site, method_name):
        self.site = device_site
        self.method = method_name
        Resource.__init__(self)

    def get_context(self):
        """
        返回模板上下文字典
        @return:
        """
        return self.site.get_template_context()

    def getChild(self, path, request):
        return self

    def render(self, request):
        web_handler = getattr(self.site, self.method)

        # 当模板渲染完成后调有
        def on_render_template(results):
            request.write("<!DOCTYPE html>")
            request.write(results)
            request.finish()

        # 当异步执行web方法完成后调用
        def on_webhandler_complate(results):
            # results="callback"且为json格式时，不发送响应头，需要其他地方自行发送=》适用于异步回调
            if results == "callback":
                return
            results = results if results is not None else {} if web_handler.content_type == "json" else ""
            if web_handler.template is not None and isinstance(results, dict):  # 渲染模板
                context = self.get_context()
                context.update(results)
                page = DevicePageTemplate(
                    loader=XMLFile(FilePath(os.path.join(self.site.get_tempalte_folder(), web_handler.template))),
                    context=context)
                flattenString(request, page).addCallback(on_render_template)
            else:
                # request.setHeader("Content-Type", "application/json;charset=UTF-8")  # 解决中文乱码
                if web_handler.content_type == "json" and isinstance(results, (dict, str)):
                    request.setHeader("Content-Type", "application/json;charset=UTF-8")  # 解决中文乱码
                    request.setHeader("Access-Control-Allow-Origin", "*")  # 解决跨域问题
                    results = json.dumps(results, ensure_ascii=False)
                request.write(results)
                request.finish()

        b = self.site.aspect(request)
        if b == True:  # AOP
            if web_handler.async:  # 采用线程异步执行方法
                d = threads.deferToThread(web_handler, request)
                d.addCallback(on_webhandler_complate)
                d.addCallback(lambda _: request.finish())
            else:
                results = web_handler(request)
                on_webhandler_complate(results)
        elif b == False:
            request.finish()
        else:
            pass
        return NOT_DONE_YET


class DeviceSiteBase(static.File):
    """
    每个设备对应的站点基类
    """
    activated = True  # 是否激活
    version = "1.0"
    device_type = ""  # 设备类型
    device_name = ""  # 设备中文名称
    device_root = "webroot"  # 设备站点根文件夹，默认放在devices/<device_type>文件夹下,%(site_root)s代表根文件夹
    template_path = "templates"  # 模板文件夹
    site_root = ""  # 根站点所在目录
    urls = {}

    def __init__(self, path, defaultType="text/html", ignoredExts=(), registry=None, allowExt=0):
        static.File.__init__(self, path, defaultType, ignoredExts, registry, allowExt)
        self.collect_page_urls()

    def aspect(self, request):
        """
        AOP切面
        :param request:
        :return: True:继续执行后面的方法 False:关闭http None:什么都不做
        """
        return True

    def getChild(self, path, request):
        resource = self.get_matched_resource(request)
        if resource is None:
            return static.File.getChild(self, path, request)
        else:
            return resource

    def render_GET(self, request):
        return static.File.render_GET(self, request)

    def get_matched_resource(self, request):
        """
        获取匹配的URL处理方法
        @param path:
        @return:
        """
        if request.prepath[0] == "api":
            url = request.prepath[1]
        else:
            url = request.path.replace("/devices/%s/" % self.device_type, "").lower()
        func_name = self.urls.get(url, None)
        if func_name is None:
            return None
        return DevicePage(self, func_name)

    def collect_page_urls(self):
        """
        收集定义在类中的动态页面URL列表
        {
            url:"方法名"
        }
        """

        for member_name in dir(self):
            if member_name == "home":
                pass
            try:
                obj = getattr(self, member_name)
                if hasattr(obj, "ispage") and hasattr(obj, "url"):
                    self.urls[obj.url] = obj.__name__
            except:
                pass

    def get_tempalte_folder(self):
        """
        取得设备模板文件夹路径
        @return:
        """
        template_path = self.template_path % dict(site_root=self.site_root)
        return os.path.join(os.path.dirname(inspect.getfile(self.__class__)), template_path)

    def get_template_context(self):
        context = {
            "device_type": self.device_type,
            "device_name": self.device_name,
            "site_folder": self.site_root,
            "version": self.version,
            "template_folder": self.get_tempalte_folder()
        }
        return context


class DeviceManagerSite(Resource):
    """
        管理设备站点的类
    """
    device_types = {}  # 用来保存设备类型处理类实例
    root_site = None  # 根Site站点对象

    def __init__(self, root_site):
        Resource.__init__(self)
        self.root_site = root_site

    def getChild(self, device_type, request):
        if device_type not in self.device_types:
            self.create_device_site(device_type, request)
        return self.device_types[device_type]

    def create_device_site(self, device_type, request):
        """
        根据输入的device_type查找位于devices/<device_type>/website.py文件，
        载入里面定义的DeviceSiteBase类，用该类实例来处理设备站点逻辑
        @param device_type:
        @param request:
        @return:
        """
        version = request.args.get("version", None)
        device_site_class = None
        device_type_moudle = import_object("devices.%s.website" % device_type.lower())
        device_sites = []
        for item in dir(device_type_moudle):
            obj = getattr(device_type_moudle, item)
            try:
                if issubclass(obj, DeviceSiteBase):
                    if obj.__name__ != "DeviceSiteBase":
                        device_sites.append(obj)
            except:
                pass

        # 可以在resource里面定义多个DeviceSiteBase的类，取其中第一个activated=True的类
        for item in device_sites:
            if version is None:
                if item.activated:
                    device_site_class = item
                    break
            else:
                if item.version == version:
                    device_site_class = item
                    break
        if device_site_class is None and len(device_sites) > 0:
            device_site_class = device_sites[0]

        # 创建设设备类型站点类实例
        device_site_obj = device_site_class(self.get_device_root(device_site_class))
        device_site_obj.site_root = self.root_site.root
        self.device_types[device_type] = device_site_obj

    def get_device_root(self, device_site_class):
        """
        获取设备站点根文件的完整路径
        @return:
        """

        device_path = device_site_class.device_root % dict(site_root=self.root_site.root)
        if not (os.path.exists(device_path) and os.path.isdir(device_path)):
            # 默认将根文件夹放在该设备类型下devices/safebox/webroot
            # 通过调用inspect.getfile取得当前子类所在文件夹
            device_path = os.path.join(os.path.dirname(inspect.getfile(device_site_class)), device_path)
            if not os.path.exists(device_path):
                os.makedirs(device_path)
        return device_path

    def render_GET(self, request):
        return request.args["echostr"][0]


class HomeSite(static.File):
    """
        处理根目录资源
    """
    pass


class SmartTalkWebSite(Site):
    root = os.path.join(os.path.abspath(os.path.dirname(__file__)), "webroot")
    settings = None
    session = None

    def __init__(self, requestFactory=None, *args, **kwargs):
        self.resource = self.create_resources()
        Site.__init__(self, self.resource, requestFactory, *args, **kwargs)

    def create_resources(self):
        from devices.safebox.appClient import appClientManager
        from devices.safebox.api import ShenYanV6Site
        from devices.safebox.voerkaClient import voerkaClientManager
        from devices.safebox.webapiClient import webapiClientManager
        resource = HomeSite(self.root)
        resource.putChild("webapi",webapiClientManager(self))
        resource.putChild("devices", DeviceManagerSite(self))
        # resource.putChild("weixin", DeviceWeiXinSite())
        resource.putChild("auth", appClientManager(self))
        resource.putChild("api", ShenYanV6Site(self))
        resource.putChild("voerka", voerkaClientManager(self))
        return resource

class PlayRecordSite(static.File):
    """
        处理根目录资源
    """
    pass

class IPTalkWebSite(Site):
    root = os.path.join(os.path.abspath(os.path.dirname(__file__)), "webroot")
    #recDir = os.path.abspath(sys.path[0] + "/data/ftp/Record")
    print("-------------FTP_REC_ROOT: %s" %FTP_REC_ROOT)
    settings = None
    session = None

    def __init__(self, requestFactory=None, *args, **kwargs):
        self.resource = self.create_resources()
        Site.__init__(self, self.resource, requestFactory, *args, **kwargs)

    def create_resources(self):
        from devices.iptalk.webmanager import IPTalkWebManager,IPTalkWebHome,IPTalkSysConfiger,IPTalkSysUpgrader,IPTalkRecordManager,IPTalkLive
        from devices.iptalk.apimanager import IPTalkApiManager
        # from test2 import TestApi
        resource = HomeSite(self.root)
        resource.putChild("",IPTalkWebHome(self))
        resource.putChild("devices", IPTalkWebManager(self))
        resource.putChild("config", IPTalkSysConfiger(self))  # http://localhost:85/**config**/<sysconfig|...>
        resource.putChild("upgrade", IPTalkSysUpgrader(self))  # http://localhost:85/**upgrade**/<sysUpgrade|...>
        resource.putChild("api",IPTalkApiManager(self))
        resource.putChild("playback", IPTalkRecordManager(self))  # http://localhost:85/**playback**?cmd=<start|...>
        resource.putChild("recstoreage", PlayRecordSite(FTP_REC_ROOT))  #http://localhost:85/recstoreage 分片文件存储地址
        resource.putChild("live", IPTalkLive(self))  # http://localhost:85/**live**?cmd=<start|stop>&devip=<depip>?
        return resource
