# -*- coding:utf-8 -*-
__author__ = 'zhwx'
from twisted.web.resource import Resource,NoResource,ErrorPage
from wechatpy.utils import check_signature
from wechatpy import parse_message, create_reply
from wechatpy.utils import check_signature
from wechatpy import WeChatClient
from wechatpy.exceptions import (
    InvalidSignatureException,
    InvalidAppIdException,
)

#测试号
APP_ID="wx3e978e6adee17863"
APP_SECRET="52f353e258bc27a21308e5444c41da7c"
APP_TOKEN="wenxuan"
APP_MSG_AES_KEY="EP1OYLlOfvG5zcfqes8MUiR4Mol1y9GTtMzM2jojTEP"

access_token=""

class DeviceWeiXinSite(Resource):
    WeChatClient=None
    def __init__(self):
        Resource.__init__(self)
        self.ini_wxclient()

    def ini_wxclient(self):
        self.WeChatClient=WeChatClient(APP_ID,APP_SECRET,APP_TOKEN)

    def getChild(self, path, request):
        if path=="":return self

    def render_GET(self,request):
        """
        响应微信
        @param request:
        @return:
        """
        return request.args["echostr"][0]
    def create_menu(self):
        menu=self.WeChatClient.menu
        menu.delete()
        menu.create({
            "button":[
            {
                "type":"click",
                "name":u"美一物联",
                "key":"meeyiiot"
            },
            {
                "type":"view",
                "name":u"我的保险箱",
                "key":"mysafebox",
                "url":"http://wenxuansoft.gicp.net/devices/safebox"
            }]
        })

    def render_POST(self,request):

        signature = request.args.get('signature', '')[0]
        timestamp = request.args.get('timestamp', '')[0]
        nonce = request.args.get('nonce', '')[0]
        encrypt_type = request.args.get('encrypt_type', 'raw')[0]
        try:
            check_signature(APP_TOKEN, signature, timestamp, nonce)
        except InvalidSignatureException as E:
            return ErrorPage(403,u"微信签名验证出错！",E.message)


        #self.create_menu()

        msg = parse_message(request.content.read())
        # POST request
        # if encrypt_type == 'raw':
        #     if msg.type == 'text':
        #         reply = create_reply(msg.content, msg)
        #     else:
        #         reply = create_reply('Sorry, can not handle this for now', msg)
        # else:
        #     reply =  create_reply('不支持加密消息', msg)
        #
        # return reply.render
        if msg.type=="text":
            reply = create_reply("hello:"+msg.content, msg)
            return reply.render().encode("utf8")
        else:
            return "".encode("utf8")


