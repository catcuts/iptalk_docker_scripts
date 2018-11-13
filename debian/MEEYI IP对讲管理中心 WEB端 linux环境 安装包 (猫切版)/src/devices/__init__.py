# -*- coding:utf-8 -*-
__author__ = 'zhwx'
import os
from utils.importutil import import_object
from core.protocol.base import ProtocolBase,ProtocolFeatureBase

def get_device_protocol_class(device_type,version=None):
    """
    导入指定设备类型的协议处理类
    :param device_type: 设备名称
    :param version: 指定版本号
    :return: 设备协议实例对象
    """
    match_protocol = None
    protocol_moudle = import_object("devices.%s.protocol" % device_type)
    # protocol_moudle = import_object("devices.%s.protocol_old" % device_type)
    # 检索该包里面所有的ProtocolBase类
    device_protocols = []
    for item in dir(protocol_moudle):
        obj = getattr(protocol_moudle, item)
        try:
            if type(obj)==type and issubclass(obj, ProtocolBase):
                if obj.__module__ == protocol_moudle.__name__:  # 必须是在同一模块下，不能是引用的
                    device_protocols.append(obj)
        except:
            pass

    #匹配版本
    if version is not None:  # 如果指定了版本号,则需要版本号一致
        for device_protocol in device_protocols:
            if str(getattr(device_protocol, "version")) == str(version):
                match_protocol = device_protocol

    if match_protocol is None and len(device_protocols) > 0:
        match_protocol = device_protocols[0]

    return match_protocol


def find_registed_device_types():
    """
        搜索所有注册的设备协议
        返回一个设备名称列表

    """
    results=[]
    devices_path=os.path.abspath(os.path.dirname(__file__))
    for item in os.listdir(devices_path):
        folder=os.path.join(devices_path,item)
        if os.path.isdir(folder):
            if os.path.exists(os.path.join(folder,"__init__.py")):
                results.append(item)
    return results

def get_device_protocol_features():
    """
        获取所有设备协议的特征信息
        返回:
        [
            {type:"",feature:""},
            {type:"",feature:""}
        ]
        type:设备类型
        feature:如果object，则代表实例对象，如果是字符串，是说明采用简单匹配模式

        PROTOCOL_FEATURE={
            mode:0
            flags:"xc"
            scheme:"xxxx"
        }

    """
    features=[]
    devices_path = os.path.abspath(os.path.dirname(__file__))
    device_types=find_registed_device_types()
    for device_type in device_types:
        if os.path.exists(os.path.join(devices_path,device_type,"feature.py")):
            try:
                feature_obj=import_object("devices.%s.feature" % device_type)
                for member in feature_obj.__dict__:
                    try:
                        member_attr = getattr(feature_obj, member)
                        if member=="PROTOCOL_FEATURE":
                            features.append(dict(type=device_type,feature=member_attr))
                        elif feature_obj.__name__ == member_attr.__module__ :
                            if issubclass(member_attr, ProtocolFeatureBase):
                               features.append(dict(type=device_type,feature=member_attr()))
                    except:
                        pass
            except:
                pass
    return features