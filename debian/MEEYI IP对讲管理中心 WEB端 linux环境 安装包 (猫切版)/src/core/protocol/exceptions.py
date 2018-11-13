# -*- coding:utf-8 -*-
__author__ = 'zhwx'
__all__=["CommandException", "UnSupportedCommandException", "RunErrorException", "ValueErrorException",]


class CommandException(Exception):
    message="Command Exception."
    code=0
    def __init__(self,message=None,code=None):
        self.message=message or self.message
        self.code=code or self.code


class UnSupportedCommandException(CommandException):
    """
    未知命令异常
    """
    message="unsupported command"
    code=301

class RunErrorException(CommandException):
    """
    执行错误
    """
    message='runtime error.'
    code=300

class ValueErrorException(CommandException):
    """
    命令参数错误
    """
    message="parameter or value error"
    code=302

