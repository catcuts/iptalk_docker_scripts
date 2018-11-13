# -*- coding:utf-8 -*-
__author__ = 'zhwx'
from TwistedWebsocket.server import Protocol as WebSocketProtocol
from twisted.internet.protocol import Factory
import json,uuid,time,os
from core.logger import log
from twisted.internet.threads import deferToThread


class WebSocketHandler(WebSocketProtocol):
    # def onHandshake(self, header):
    #     pass

    id = ""
    args_list = {}
    def __init__(self,factory):
        WebSocketProtocol.__init__(self)
        self.factory = factory

    def connectionMade(self):
        super(WebSocketHandler,self).connectionMade()
        self.id = uuid.uuid4().hex
        self.factory.connects[self.id] = self
        try:
            self.transport.setTcpKeepAlive(1)
            log.debug("WebSocket keepAlive is on")
        except AttributeError:
            pass

    def onConnect(self):
        log.debug("websocket is connected.")
        self.sendMessage(json.dumps({"status":"ok","message":"已连接到websock"}))

    def onDisconnect(self):
        #用户下线后删除对应列表记录
        try:
            if self.id in self.factory.connects.keys():
                log.debug("delete websock TCP connect:%s" % self.id)
                del self.factory.connects[self.id]
            if self.id in self.factory.user_list.keys():
                log.debug("delete websock user:{%s}" % str(self.factory.user_list[self.id]))
                del self.factory.user_list[self.id]
        except Exception as E:
            log.error("userid:%s is not exist!" % E.message)
        log.debug("websocket is disconnected.")

    def onMessage(self, msg):
        if msg == "":
            self.sendMessage(json.dumps({"status": "error", "message": "发送消息为空"}, ensure_ascii=False))
            return
        elif "heartbeat" in msg:
            # websocket心跳测试log放在devices/safebox/testlog/wsheartbeat.txt
            user = json.loads(msg).get("username","").encode("utf-8")
            heartbeat = json.loads(msg).get("heartbeat","")
            _heartbeat = heartbeat if isinstance(heartbeat,int) else heartbeat.encode("utf-8")
            if user == "test999":  # 测试测试测试测试
                cutime = time.strftime("%Y-%m-%d %H:%M:%S")
                strlog = cutime+" heartbeat: "+str(_heartbeat)+"\n"
                filedir = os.path.join(os.path.join(os.path.abspath(os.path.dirname(__file__) + os.path.sep + ".."),
                                    "devices", "safebox", "testlog","ws_heartbeat%(date)s.txt"))%dict(date=time.strftime("%Y%m%d"))
                def writeStream():
                    try:
                        with open(filedir, 'a') as fs:
                            fs.writelines(strlog)
                            fs.flush()
                    except Exception as E:
                        log.error(str(E))
                deferToThread(writeStream)
            self.sendMessage(json.dumps({"status": "success", "message": "心跳","heartbeat":_heartbeat,"type":"heartbeat"}, ensure_ascii=False))
            log.debug("websocket " + user + " heartbeat:%s"%_heartbeat)
            return

        if "\x03\xe9" not in msg:
            if "iswebclient" in msg:
                self.webClientWebsock(msg)
            else:
                self.appWebsock(msg)


    def appWebsock(self, msg):
        try:
            userinfo = json.loads(msg)  # 解析用户登录信息
            username = userinfo.get("username", "").encode("utf-8")  # 获取到用户名
            sn = userinfo.get("sn", "").encode("utf-8")  # 获取sn
            # self.sendMessage(msg)  # 返回登录信息。
            from devices.safebox.protocol import my_dbmanager
            # def getSNCallback(query):
            #     if query.exists():
            #         if query.get().isLogin:
            #             self.sendMessage(
            #                 json.dumps({"type": "200", "message": {'defence': 'on', 'door': 'off', 'power': 'on',
            #                                                        'battery': 'high', 'alarm': 'off', 'signal': '',
            #                                                        'sensitivity': '', 'humidity': '',
            #                                                        'temperature': '', 'confirm': 'off'},
            #                             'translation': ""}))
            #
            # my_dbmanager.get("Device", sn, getSNCallback)
            # if self.is_user_online(username):
            #     return

            def getOwnerDeviceBack(data):
                userinfo["owner_devices"] = data
                my_dbmanager.get(["FriendDevice", "User"], username, getFriendDeviceBack)

            def getFriendDeviceBack(data):
                userinfo["friend_devices"] = data
                self.factory.user_list[self.id] = userinfo
                # 打印websocket在线用户
                for k in self.factory.user_list.values():
                    log.debug("websock_online_users:{%s}" % str(k))

                log.debug("user:%s online!" % username)

            my_dbmanager.get(["OwnerDevice", "User"], username, getOwnerDeviceBack)

        except Exception as E:
            log.error(E.message)


    def webClientWebsock(self,msg):
        """
        web端的websocket登录信息多一个iswebclient字段
        :param msg:
        :return:
        """
        userinfo = json.loads(msg)  # 解析用户登录信息
        username = userinfo.get("username","").encode("utf-8")  # 获取到用户名

        # if self.is_user_online(username):
        #     return

        from devices.safebox.protocol import my_dbmanager

        def getAgentDeviceBack(data):
            if data is not None:
                userinfo["agentDevice"] = data
                self.factory.user_list[self.id] = userinfo

                for k in self.factory.user_list.values():
                    log.debug("websock_online_users:{%s}" % str(k))
                log.debug("agentUser:%s online!" % username)
            else:
                log.info("查询的用户不存在！")

        my_dbmanager.get(["AgentDevice", "AgentUser", "snForWebClient"], username, getAgentDeviceBack)

    # def is_user_online(self,username):
    #     for value in self.factory.user_list.values():
    #         _user = value.get("username", "").encode("utf-8")
    #         if _user == username:
    #             return True

class WebSocketFactory(Factory):
    port=8072
    def __init__(self):
        self.user_list = {}
        self.connects={}
    def buildProtocol(self, addr):
        return WebSocketHandler(self)

    def get_user(self):
        pass
    def find_user(self):
        pass
    def pushMessageByWebsock(self,*args,**kwargs):
        if self.user_list.keys():  # 调用者必须上线才能发出消息请求
            for key,value in self.user_list.items():
                # 所有在线的保险箱托管者和拥有者都能收到推送消息
                owner_devices = value.get("owner_devices","")
                friend_devices = value.get("friend_devices","")
                agentDevice = value.get("agentDevice","")
                username = value.get("username","")
                if args[0] in owner_devices or args[0] in friend_devices or args[0] in agentDevice:
                    try:
                        sid = kwargs.get("message","").get("sid","") if isinstance(kwargs.get("message",""),dict) else ""
                        if sid: #稳定性测试开启
                            from devices.safebox.util import stability_test_WS_to_app
                            stability_test_WS_to_app(self,sid,key,**kwargs)
                        else:
                            if "sos" in  kwargs.get("message","") or "user" in kwargs.get("message",""):
                                if "iswebclient" not in value:
                                    continue
                                else:
                                    self.connects[key].sendMessage(json.dumps(kwargs))
                            else:
                                self.connects[key].sendMessage(json.dumps(kwargs))

                        log.debug("Push message to websocket which <username=%s,type=%s,sn=%s>" % (username,kwargs.get("type", ""), kwargs.get("sn", "")))
                    except Exception as E:
                        log.error("Push message to websocket error:%s" % E.message)
                else:
                    continue
        else:
            log.debug("没有websocket用户在线")

WebSocketServer=WebSocketFactory()