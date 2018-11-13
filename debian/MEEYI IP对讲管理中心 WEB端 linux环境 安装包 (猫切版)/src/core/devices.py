# -*- coding:utf-8 -*-
"""
    临时模块，用来保存设备的状态等信息
"""
__author__ = 'zhwx'
import os
import datetime
import json
import os
from twisted.persisted import dirdbm
# datafile=os.path.join(os.path.abspath(os.path.dirname(__file__)+os.path.sep+".."),"data","devices")
# dbase = shelve.open("mydbase")

class Device(dict):
    def __init__(self,**kwargs):
        kwargs.setdefault("id","WET35FHIOIUOK")
        kwargs.setdefault("name","客厅保险箱")
        kwargs.setdefault("owner","张三丰")
        kwargs.setdefault("type","智能保险箱")
        kwargs.setdefault("online",False)
        kwargs.setdefault("ip","")
        kwargs.setdefault("events",[])#保险箱事件
        kwargs.setdefault("image","")#最后一次上传的保险箱图片
        kwargs.setdefault("defence","off")#是否设防
        kwargs.setdefault("alarm","off")#警铃
        kwargs.setdefault("coord","")#地理坐标
        kwargs.setdefault("temp","24%")#温度
        kwargs.setdefault("hum","36")#
        kwargs.setdefault("door", "off")  #
        kwargs.setdefault("power", "on")  #
        kwargs.setdefault("hum", "36")  #
        kwargs.setdefault("battery", "mid")  #
        kwargs.setdefault("signal", "0")  #

        kwargs.setdefault("confirm_for_door",False)#
        super(Device,self).__init__(**kwargs)

    def __setitem__(self, key, value):
        #很次加载时均向终端发送状态
        dict.__setitem__(self,key,value)
        self.notify_clients()
    def notify_clients(self):
        from web.websock import WebSocketServer
        for id,client in WebSocketServer.users.items():
            client.sendMessage(json.dumps(device))

    def add_event(self,message,level=0):
        """
        @param message:
        @param level: level=9，代表该条事件需要客户端进行确认
        @return:
        """
        now=datetime.datetime.now()
        date=datetime.datetime.strftime(now,'%m/%d')
        time=datetime.datetime.strftime(now,'%H:%M:%S %z')
        self["events"].insert(0,dict(level=level,message=message,time=time,date=date))

    def clear_events(self):
        self["events"]=[]


#仅仅支持一个
devices=[]
device=Device()
device.add_event("欢迎使用美一智能保险箱！")
device.add_event("保险箱服务开始启动.")
device.add_event("报警服务准备就绪！")

def get_device(deviceid):
    device_data = dirdbm.Shelf(os.path.join(os.path.abspath(__file__),os.sep,"..","data","devices"))
    return device_data[deviceid]

