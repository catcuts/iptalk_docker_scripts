# -*- coding:utf-8 -*-
"""
    用来访问数据库
"""
__author__ = 'zhwx'
from twisted.persisted import dirdbm
from core.logger import log
import os,json
import uuid


class UserManagerBase(object):
    dblocation = ""
    default={"username":"","password":"","email":"","phone":"","isLogin":"false","owner_devices":[],"friend_devices":[],"friends":[],"messages":[],"verification_code":"","times":"","record_time":"",
             "settings":{"isShow":"true","door":"true","battery":"true","vibration":"true","power":"true","panel":"true","user":"true","beep":"true"}}
    def __init__(self):
        try:
            self.dblocation=os.path.join(os.path.abspath(os.path.dirname(__file__) + os.path.sep + ".."), "data","users")
            if not os.path.exists(os.path.dirname(self.dblocation)):
                os.makedirs(os.path.dirname(self.dblocation))
            self.db=dirdbm.Shelf(self.dblocation)
        except Exception as E:
            log.error(E.message)

    def update_user(self,username,*args,**kwargs):
        try:
            d=self.db[username]
            d.update(kwargs)
            self.db[username]=d
        except Exception as E:
            log.error(E.message)

    def exists(self,username):
        return username in self.db.keys()

    def new_user(self,username,**kwargs):
        try:
            kwargs["username"]=username
            self.default.update(kwargs)
            self.db[username]=self.default
        except Exception as E:
            log.error(E.message)

    def get_list(self):
        return self.db.keys()

    def get(self,username):
        return self.db[username]

    #验证用户名密码
    def auth(self,username,password):
        if self.exists(username):
            if self.db[username]["username"] == username and self.db[username]["password"] == password:
                return True
            else:
                return False
        else:
            return False


class DeviceManagerBase(object):
    dblocation = ""
    default = {"username": "", "password": "","boxdoorPwd":"123456" ,"sn": "", "device_ip": "", "device_name": "","device_local": "","owner":"","confirm":"on","sensitivity":"12","pointList":[],"coord":"","updateVersionTimes":""}

    def __init__(self):
        try:
            self.dblocation = os.path.join(os.path.abspath(os.path.dirname(__file__) + os.path.sep + ".."), "data","devices")
            if not os.path.exists(os.path.dirname(self.dblocation)):
                os.makedirs(os.path.dirname(self.dblocation))
            self.db = dirdbm.Shelf(self.dblocation)
        except Exception as E:
            log.error(E.message)

    def new_device(self, device_id, **kwargs):
        # kwargs.setdefault("sn",device_id)
        # kwargs.setdefault("owner","")
        try:
            self.default.update(kwargs)
            self.db[device_id] = self.default
        except Exception as E:
            log.error(E.message)

    def update_device(self, device_id, *args, **kwargs):
        try:
            d = self.db[device_id]
            d.update(kwargs)
            self.db[device_id] = d
        except Exception as E:
            log.error(E.message)

    def exists(self, device_id):
        return device_id in self.db.keys()

    def get_list(self):
        return self.db.keys()

    def get(self, device_id):
        return self.db[device_id]


class MessagesManagerBase(object):
    dblocation = ""
    # default = {"eventid": "", "type": "", "message": {}, "level": "", "uid": "", "sn": "", "time": ""}
    default = []
    def __init__(self):
        try:
            self.dblocation = os.path.join(os.path.abspath(os.path.dirname(__file__) + os.path.sep + ".."), "data","messages")
            if not os.path.exists(os.path.dirname(self.dblocation)):
                os.makedirs(os.path.dirname(self.dblocation))
            self.db = dirdbm.Shelf(self.dblocation)
        except Exception as E:
            log.error(E.message)

    def new_message(self,device_id,kwargs):
        try:
            eventid = uuid.uuid4().hex
            kwargs["eventid"] = eventid
            self.default.append(kwargs)
            self.db[device_id] = self.default
            del self.default[:]
        except Exception as E:
            log.error(E.message)

    def update_message(self, device_id,kwargs):
        try:
            eventid = uuid.uuid4().hex
            kwargs["eventid"] = eventid
            d = self.db[device_id]
            d.append(kwargs)
            if len(d) > 100:  # 超过100条消息就按时先后顺序删除
                length = len(d) - 100
                del d[:length]
            self.db[device_id] = d
        except Exception as E:
            log.error(E.message)

    def get_list(self):
        return self.db.keys()

    def get(self, device_id):
        return self.db[device_id]

    def exists(self, device_id):
        return device_id in self.db.keys()

class TraceManagerBase(object):
    dblocation = ""
    coords=[]
    max_count=10
    keep = 0
    def __init__(self):
        self.init()

    def init(self):
        try :
            self.dblocation = os.path.join(os.path.join(os.path.abspath(os.path.dirname(__file__) + os.path.sep + ".."), "data","traceCoords")) #  os.getcwd(),"data","traceCoords"
            if not os.path.exists(self.dblocation):
                os.makedirs(self.dblocation)
        except Exception as E:
            log.error(E.message)

    def append(self,coord,speed,time,sn):
        dictt = {}
        dictt.update(dict(time=time,coord=coord,sn=sn,speed=speed))
        self.coords.append("%s\n" % dictt)
        # self.coords.append("%s,%s,%s\n" % (time,coord,speed))
        if len(self.coords)>=self.max_count:
            self.save(sn)

    def save(self,sn):
        try:
            filename="%s.txt" % sn
            path = os.path.join(self.dblocation,filename)
            with open(path,'a') as fs:
                fs.writelines(self.coords)
                self.coords=[]
                # line=fs.readline()
                # time, coord, speed=line.split(",")
            data = []
            if os.path.getsize(path)>113*17280: #17280，一天的数据量
                with open(path,"r+") as fs:
                    for line in fs:
                        data.append(line)
                        if len(data) > 5000:
                            data.pop(0)
                    fs.seek(0,0)
                    fs.truncate()
                    fs.writelines(data)
                    del data[:]
        except Exception as E:
            log.error(E.message)

    #从文件末尾向前读取，逆序
    # def get1(self,sn,n):
    #     filename = "%s.txt" % sn
    #     path = os.path.join(self.dblocation, filename)
    #     data = []
    #     with open(path,'r') as fs:
    #         for i in range(n+1):
    #             if i>0:
    #                 fs.seek(-113*i,2)
    #                 data.append(fs.readline())
    #                 print fs.tell()
            #读取后几条
            # fs.seek(-113*n,2)
            # print fs.tell()
            # data.append(fs.readlines())
            # print fs.tell()
            # print data


    def get(self,sn,username,n):
        from web.websock import WebSocketServer
        filename = "%s.txt" % sn
        path = os.path.join(self.dblocation, filename)
        wsockobj = None
        if WebSocketServer.user_list.keys():
            for key_id in WebSocketServer.user_list.keys():
                userinfo = WebSocketServer.user_list[key_id]
                if sn == userinfo["sn"] and username == userinfo["username"]:
                    wsockobj = WebSocketServer.connects[key_id]
                    break
                else:
                    continue
            else:
                return "false"
        else:
            return "false"

        try:
            with open(path, 'r') as fs:
                fs.seek(self.keep,1)
                for i in range(n):
                    wsockobj.sendMessage(json.dumps(fs.readline()))
                self.keep = fs.tell()
        except Exception as E:
            log.error(E.message)

    def clean(self):
        self.keep = 0

UserManager = UserManagerBase()

DeviceManager=DeviceManagerBase()

MessagesManager=MessagesManagerBase()

TraceManager = TraceManagerBase()