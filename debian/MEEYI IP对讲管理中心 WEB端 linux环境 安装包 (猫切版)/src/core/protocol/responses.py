# -*- coding:utf-8 -*-
"""
    本模块用来实现向客户端发送响应数据的功能
    例：




"""
__author__ = 'zhwx'
__all__=["Response", "SuccessResponse", "ErrorResponse", "UnSupportedCommandResponse", "ValueErrorResponse",
         "RawResponse","ReadyResponse","ReadyResponseContent"]

RESPONSE_READY = 100  # 当设置协议选择完毕后返回此响应码
RESPONSE_SUCCESS = 200  # 成功
RESPONSE_ERROR = 300  # 执行错误
RESPONSE_ERROR_NOT_SUPPORT = 301  # 未知命令或不支持
RESPONSE_ERROR_VALUE = 302  # 参数或值错误
RESPONSE_REDIRECT = 400  # 重定向

class Response(object):
    binary=False                    #二进制响应模式
    splitchar=" "#多个参数之间使用的分割符
    code=RESPONSE_SUCCESS#响应码
    prefix=""#响应前缀内容
    suffix=""#响应后缀内容
    def __init__(self,*args,**kwargs):
        self.args=args
        self.code=kwargs.get("code",self.code)
        self.splitchar=kwargs.get("splitchar",self.splitchar)
        self.prefix = kwargs.get("prefix", self.prefix)
        self.suffix = kwargs.get("suffix", self.suffix)

    def __call__(self):
        args=[str(item) for item in self.args]
        result=self.splitchar.join(args)
        result=self.splitchar.join([self.prefix,result,self.suffix]).strip()
        #加入前置响应码
        if len(str(self.code))>0:
            result="%s %s" % (str(self.code),result)
        return result

class ReadyResponse(Response):
    code=RESPONSE_READY
    prefix = "Ready"

class SuccessResponse(Response):
    code=RESPONSE_SUCCESS

class ErrorResponse(Response):
    code=RESPONSE_ERROR

class UnSupportedCommandResponse(Response):
    code=RESPONSE_ERROR_NOT_SUPPORT
    prefix="UnSupported command."

class ValueErrorResponse(Response):
    code=RESPONSE_ERROR_VALUE
    prefix = "error parameter or value."

class RedirectResponse(Response):
    code=RESPONSE_REDIRECT
    

class RawResponse(Response):
    """
    该类用来响应一个没有状态码的内容
    将原始内容原样输出
    如果输入多个内容，则使用回车换行符分开
    """
    code=""
    splitchar="\r\n"


class BinaryResponse(Response):
    """
    该类用来响应一个没有状态码的内容
    将原始内容原样输出
    如果输入多个内容，则使用回车换行符分开
    """
    code = ""
    splitchar = ""


ReadyResponseContent=ReadyResponse()