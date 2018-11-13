# -*- coding:utf-8 -*-
"""
    网元管理模块

    网元指物联网中的逻辑单元，可以是设备，也可能是一个分组对象等

    网元具有属性和状态两类数据：
    1、属性指网元的静态属性数据，如设备MAC地址，名称等
    2、状态是动态数据，状态原则上不保存到数据库，而是保存在缓存中，如是否在线等

"""
__author__ = 'zhwx'

class NEObjectBase(object):
    type=""                         #网元类型，=设备类型
    class State:
        """ 网元状态 """
        pass
    class Props:
        """
            网元属性
        """
        pass

class NEDeviceObject(NEObjectBase):
    """
        设备类型的网元
    """
    pass


