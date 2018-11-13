# -*- coding:utf-8 -*-
"""
   Cache模块

###配置参数
  配置参数保存在Portal配置文件的[cache]段中。

  type：取值可以是file, dbm, memory, ext:memcached, ext:database, ext:google,redis
  expire：默认的过期时间，以秒为单位，可以被get_cache,put方法覆盖。
  enabled：默认True,是否开启与关闭Cache.
  memcache_module：默认auto,指定使用哪一种memcached客户端， memcache, cmemcache, pylibmc一般不需要指定。

  以下参数适合以特定的cache type:
   #type=file
       data_dir:cahce保存位置
       lock_dir:可选cahce保存位置
    #type=ext:memcached  ,redis
    url:指定连接地下，如当type=redis时，url= 127.0.0.1:6379

   特别注意：
   [cache]段可以有两种配置方法，一种是只有一个region，一种是有多个region.
   如果只有一个region,则只需要按上述配置项即可。
   如果有多个region，则样式如下
       [cache]
        [[file]]
        type=file
        data_dir=data/cache/data
        lock_dir=data/cache/lock
        [[redis]]
        url=127.0.0.1:6379
    然后在应用时就可以指定region参数，相当于指定不同的存储缓存后端,所有region均采用同样的超时时间，
    但也可以在调用set_value时另外指定expire覆盖

###使用方法

     1、配置正确的Cache参数
     2、直接引入import Cachemanager
    然后调用Cachemanager的各种装饰器和主法
        Cachemanager.cache：装饰器，用来装饰函数返回结果。
        Cachemanager.invalidate:方法使指定的函数缓存结果失效
        Cachemanager.get_cache：获取或创建指定的名称的cache对象，然后就可以调用cache对象的set,del,get等方法进行缓存

     2、可选：如果启用VCache中间件，则可以自动对指定的视图进行自动化缓存



"""
__author__ = 'zhwx'
import os
from beaker.cache import CacheManager as beakerCacheManager
from beaker.util import parse_cache_config_options
from settings import Settings
from core import portal_location

class CacheManagerBase(object):
    """
    缓存管理器
    """
    _manager=None
    _cache=None
    _region_enabled=False
    regions=[]

    def fix_path(self,spath):
        """
        修正路径
        当使用文件作为缓存的情况下
        在配置路径时可以不必使用绝对路径，而使用相对路径，本函数将相对路径修改为绝对路径
        默认缓存位置使用data/cache，需要进行默认配置
        :param path:
        :return:
        """
        if os.path.exists(spath):
            return spath
        else:
            spath=spath.replace("%portal%",portal_location)
            if not os.path.exists(spath):
                spath= os.path.join(portal_location,spath)

            spath=spath.replace("/",os.sep)
            spath=spath.replace("\\",os.sep)
            return spath

    def __init__(self):
        #默认的cache配置，如果没有指定cache配置，则采用一个默认的文件做缓存
        default_data_dir=os.path.join(portal_location,"data","cache","data")
        default_lock_dir=os.path.join(portal_location,"data","cache","lock")
        if not os.path.exists(default_data_dir):
            os.makedirs(default_data_dir)
        if not os.path.exists(default_lock_dir):
            os.makedirs(default_lock_dir)

        default_cache_options = {
            'cache.type': 'file',
            'cache.data_dir': default_data_dir,
            'cache.lock_dir': default_lock_dir,
        }
        if Settings.has_key("cache"):
            self._config=Settings["cache"]
            #查询是否有子段,则说明配置了多个region
            if Settings.has_sub_section("cache"):
                self.regions=[item[0] for item in Settings["cache"].iteritems() if isinstance(item[1], dict)]
                cache_opts={
                    'cache.data_dir': default_data_dir,
                    'cache.lock_dir': default_lock_dir,
                    "cache.regions":",".join(self.regions)
                }
                for region in self.regions:
                    cache_opts.update({ "cache.%s.%s" % (region,item[0]):item[1] for item in Settings["cache"][region].iteritems()})
                self._region_enabled=True
            else:#没有配置多个region
                cache_opts=default_cache_options
                cache_opts.update({ "cache.%s" % item[0]:item[1] for item in Settings["cache"].iteritems()})
            #针对文件型缓存进行路径修复
            for k,v in cache_opts.iteritems():
                try:
                    if k.find("data_dir")>=0 or k.find("lock_dir")>=0:
                        cache_opts[k]=self.fix_path(cache_opts[k])
                except:
                    pass
        else:
            cache_opts=default_cache_options

        self._manager=beakerCacheManager(**parse_cache_config_options(cache_opts))

    def get_cache(self,namespace="",region=None,**kwargs):
        """

            获取一个cache对象

            cache对象提供以下方法:
            get,get_value
            put,set_value
            remove_value
            clear:
            has_key

        :param namespace: cache的名称空间,管理器根据namespace来分别保存cache值,不同namespace的同一个值是不会冲突的
        如：cache1=CacheManager.get_cache("a")
            cache1.set_value("n",1)
            cache2=CacheManager.get_cache("b")
            cache2.set_value("n",2)

            cach1.get("n")   ------>  1
            cach2.get("n")   ------>  2
        :param namespace:
        :param region:
        :param kwargs:
        :param expire:过期时间,以秒为单位
        :return:

        """
        if self._region_enabled and region is not None:
            return self._manager.get_cache_region(namespace,region)
        else:
            return self._manager.get_cache(namespace,**kwargs)

    def cache(self,namespace="",region=None,expire=300):
        """
        自动cahce装饰器
        该方法可能实现对函数返回结果进行自动缓存
        该方法是根据模块路径名称+namespace+函数名+参数值来构造cache key的
        如def sum(a,b)定义在c:\temp\abc.py里面
        则cache=get_cache("c:\temp\abc.py|sum")
        然后使用“namespace+a值+b值”作为cache key

        因此当函数调用时，如果参数值一样，则会返回缓存值
        如果函数调用的参数不一样，则代表了不同的缓存key

        缓存参数：
            <namespace>:可选，用来构建cache key的
            expire:过期时间，以秒为单位
            <region>：可选region,相当于指定不同的存储缓存后端,所有region均采用同样的超时时间，但也可以在调用set_value时另外指定expire覆盖


        使用方法:
        @CacheManager.cache(<namespace>,expire=200)
        def sum(a,b):
            print sum
            return a+b

        如果在调用sum时，在sum中加个命名参数cache=False
        >print sum(1,3)
        in sum
        4
        >print sum(1,3)
        4
        >print sum(1,3,cache=False)   #在这一句中传入了一个sum未定义的参数，则函数结果缓存会失效
        in sum
        4


        """
        def _cache(func):
            if self._region_enabled and region is not None:
                f=self._manager.region(region,namespace)(func)
            else:
                f=self._manager.cache(namespace,expire=expire)(func)
            def dynamic_func(func):
                def _func(*args,**kwargs):
                    use_cache=kwargs.pop("cache",True)
                    #如果函数传入了cache=False,则会调用使用缓存失效
                    if not use_cache:
                        self.invalidate(func,namespace,region,*args)
                    return func(*args,**kwargs)
                return _func
            return dynamic_func(f)
        return _cache

    def invalidate(self,func,namespace="",region=None,*args,**kwargs):
        """
            使缓存对象失效
        :param func:缓存函数对象
        :param namespace: cache装饰时指定的namespace
        :param region: cache装饰时指定的region
        :param args: 函数的所有参数值
        :param kwargs:
        例：
            @CacheManager.cache("test",expire=60)
            def sum(a,b):
                print "in sum"
                return a+b

            >print sum(1,2)
            in sum
            3
            >print sum(1,2) 由于函数相同，所以直接从缓存返回值
            3
            >CacheManager.invalidate(sum,"test",1,2)
            >print sum(1,2)
            in sum
            3


            CacheManager


        :return:
        """
        if self._region_enabled and region is not None:
            self._manager.region_invalidate(func,namespace,region,*args)
        else:
            self._manager.invalidate(func,namespace,*args)



CacheManager=CacheManagerBase()

# beaker.session.type = redis
# beaker.session.url = 127.0.0.1:6379
# cache_opts = {
#     'cache.data_dir': '/tmp/cache/data',
#     'cache.lock_dir': '/tmp/cache/lock'
#     'cache.regions': 'short_term, long_term',
#     'cache.short_term.type': 'ext:memcached',
#     'cache.short_term.url': '127.0.0.1.11211',
#     'cache.short_term.expire': '3600',
#     'cache.long_term.type': 'file',
#     'cache.long_term.expire': '86400',


        # @CacheManager.cache("abc",expire=3200)
        # def sum(a,b):
        #     print "in sum"
        #     return a+b
        # print sum(1,2)
        # print sum(1,2)
        # print sum(1,2,cache=False)
        # print sum(1,2)
        # print sum(1,2)
        #
        # aCache=CacheManager.get_cache("a")
        # aCache.set_value("aa",u"张伟雄")
        # bCache=CacheManager.get_cache("b")
        # bCache.set_value("bb",2)
        # cCache=CacheManager.get_cache("c")
        # cCache.set_value("cc",3)
        # pass
