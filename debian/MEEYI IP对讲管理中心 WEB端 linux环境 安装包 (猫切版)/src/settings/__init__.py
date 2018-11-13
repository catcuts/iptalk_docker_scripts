# -*- coding:utf-8 -*-
__author__ = 'zhwx'

import os

from configobj import ConfigObj
from validate import Validator
from utils.dicttools import merge_dict

# default.py            默认的配置值，可用于所有的环境或者被个人的环境给覆盖。
# development.py        用于开发环境的配置值。一般debug=True
# production.py         用于生产环境的配置值。在这里 DEBUG 一定要设置成 False。
# staging.py            根据开发进度，你可能会有一个模拟生产环境，这个文件主要用于这种场景。


__all__=["Settings"]

class SettingManager(dict):
    """
        该类管理IoTService相关的配置参数.
        配置文件的加载策略如下：

        1、先加载位于文件夹下面的default.ini
        3、然后根据运行模式加载development.ini,production.ini,staging.ini其中的一个配置文件来覆盖

        #如果保存配置，则会保存到最后的文件中
    """
    debug=False
    mode="development"
    def __init__(self):
        super(dict,self).__init__()
        #从环境变量读取debug,mode值
        self.debug=True if os.environ.get("SMARTTALK_IOTSERVICE_DEBUG","True").lower()=="true" else False
        #运行模式,可以是(d)evelopment, (p)roduction,(s)taging三个选项,默认为development
        run_mode=os.environ.get("SMARTTALK_IOTSERVICE_RUNMODE","development").lower()
        if run_mode in ["d", "p", "s"]:
            self.mode = [s for s in ["development", "production", "staging"] if s[0] == run_mode][0]
        elif run_mode not in ["development", "production", "staging"]:
            self.mode = "development"
        else:
            self.mode = run_mode
        #保存会根据运行模式，保存配置到对应的配置文件
        self.location=os.path.abspath(os.path.dirname(__file__))
        self.filename=os.path.join(self.location,  "%s.ini" % run_mode)
        self.spec_file=os.path.join(self.location, "settings_spec.ini")
        self.update(self._load_settings())

    def _load_settings(self):
        #取得全局默认的配置,并转为dict
        default_config=ConfigObj(infile=os.path.join(self.location, "default.ini"), default_encoding="utf-8").dict()
        try:
            #根据运行模式加载对应的配置文件development,production,staging
            self._settings=ConfigObj(infile=self.filename, configspec=self.spec_file, default_encoding="utf-8")
            self._settings.validate(Validator(), preserve_errors=True, copy=True)
            #合并覆盖到全局配置中
            merge_dict(default_config, self._settings.dict())
        except Exception as E:
            print(u"Load settings error : %s" % E)
        return default_config

    def reload(self):
        self._settings.reload()
        merge_dict(self, self._settings.dict())

    def save(self):
        self._settings.update(self)
        self._settings.raise_errors=True
        self._settings.write()

    def get(self,*args,**kwargs):
        """
        用来获取配置参数值，例:
        get_value("secname1","key",default=1)
        get_value("secname1","sub-secname","key",default=1)
        get_value("secname1","sub-secname","sub-sub-secname","key",default=1)
        注意：默认值必须是一个命名参数default=xxx
        """
        default= kwargs.pop("default",None)
        try:
            if len(args) == 1:
                return self[args[0]]
            else:
                return eval("self"+"".join(["['%s']" % x for x in args]))
        except:
            return default

    def has_sub_section(self,*args):
        """
        查询指定节是否有子段
        :return:True/False
        """
        try:
            if len(args) == 1:
                sec=self[args[0]]
            else:
                sec=eval("self"+"".join(["['%s']" % x for x in args]))
            for key in sec.iterkeys():
                if isinstance(sec[key],dict):
                    return True
        except:
            pass
        return False


#全局配置实例,单例
Settings=SettingManager()