# -*- coding: utf-8 -*-
__author__ = 'ZhangWeiXiong,wxzhang@126.com'
from sqlalchemy import Column, Integer, String,Boolean,Text,DateTime,ForeignKey

class EnableCacheModelMixin(object):
    """

        用来为model增加进行cache控制的字段

    """
    #因此可以通过cache_url设为false，使系统不会成成url handler列表清单，而是在访问时动态匹配
    cache_url=Column(Boolean,default=True)
    #是否缓存此站点数据
    cache_enabled=Column(Boolean,default=True)
    #缓存级别，根据不同类型的站点，采取不同的缓存级别，取值为0-3
    #0:尽可能缓存 ， 1:定期缓存
    cache_level=Column(Integer,default=0)

