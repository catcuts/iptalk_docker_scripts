# -*- coding:utf-8 -*-
__author__ = 'zhwx'
from functools import wraps
from core.protocol.responses import *

def ServerCommand(func):
    """
        设备命令响应处理装饰器，用来对函数的返回值进行封装，
        将命令的返回值发送给客户端连接对象
        该装饰器用在CommandHandlerBase的子类上，
        服务器命令函数如果返加字符
    @param func:
    @return:
    """
    func.iscommand=True
    @wraps(func)
    def _ResponseCommand(self,*args,**kwargs):
        """
        @param self: 指向ServerCommand装饰的方法所在实例，即Request实例
        @param args:
        @return:
        """
        try:
            result=func(self,*args,**kwargs)
            if result is None:  # 如果返回None则不做任何响应
                pass
            elif isinstance(result, Response):  # Response
                self.send_response(result)
            elif isinstance(result, (str, unicode)):  #字符串原样输出
                self.send_data(result)
        except Exception as E:
            self.send_response(ErrorResponse(E.message))#300 error message
    return _ResponseCommand

def AsyncServerCommand(func):
    """
    异步响应使命修饰，通过本修饰符允许异步进行命令处理
    @param func:
    @return:
    """
    pass