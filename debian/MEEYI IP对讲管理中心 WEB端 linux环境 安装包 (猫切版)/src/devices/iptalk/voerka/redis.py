# -*- coding:utf-8 -*-
from core import txredisapi as redis
from twisted.internet import defer, reactor
from twisted.internet.defer import returnValue


class Redis(object):
    db = None

    @defer.inlineCallbacks
    def connect(self):
        """
        连接redis服务器
        """
        self.db = yield redis.lazyConnectionPool()

    # basic
    @defer.inlineCallbacks
    def set(self, key, value):
        """
        设置指定 key 的值
        """
        r = yield self.db.set(key, value)
        returnValue(r)

    @defer.inlineCallbacks
    def get(self, key):
        """
        获取指定 key 的值
        """
        r = yield self.db.get(key)
        returnValue(r)

    @defer.inlineCallbacks
    def getset(self, key, value):
        """
        将给定 key 的值设为 value ，并返回 key 的旧值
        """
        r = yield self.db.getset(key, value)
        returnValue(r)

    @defer.inlineCallbacks
    def mset(self, mapping):
        """
        同时设置一个或多个 key-value 对
        :param mapping: 字典
        """
        r = yield self.db.mset(mapping)
        returnValue(r)

    @defer.inlineCallbacks
    def delete(self, keys):
        """
        删除一个或多个 key 及对应的值
        :param keys:一个或多个key
        """
        r = yield self.db.delete(keys)
        returnValue(r)

    # hash
    @defer.inlineCallbacks
    def hset(self, key, field, value):
        """
        将哈希表 key 中的字段 field 的值设为 value
        """
        r = yield self.db.hset(key, field, value)
        returnValue(r)

    @defer.inlineCallbacks
    def hmset(self, key, mapping):
        """
        同时将多个 field-value (域-值)对设置到哈希表 key 中
        """
        r = yield self.db.hmset(key, mapping)
        returnValue(r)

    @defer.inlineCallbacks
    def hlen(self, key):
        """
        获取hash表的长度
        """
        r = yield self.db.hlen(key)
        returnValue(r)

    @defer.inlineCallbacks
    def hget(self, key, field):
        """
        获取存储在哈希表中指定字段的值
        """
        r = yield self.db.hget(key, field)
        returnValue(r)

    @defer.inlineCallbacks
    def hgetall(self, key):
        """
        获取在哈希表中指定 key 的所有字段和值
        """
        r = yield self.db.hgetall(key)
        returnValue(r)

    @defer.inlineCallbacks
    def hdel(self, key, fields):
        """
        删除一个或多个哈希表字段
        :param fields:一个或多个field
        """
        r = yield self.db.hdel(key, fields)
        returnValue(r)

    # set
    @defer.inlineCallbacks
    def sadd(self, key, *values):
        """
        向集合添加一个或多个成员
        """
        r = yield self.db.sadd(key, *values)
        returnValue(r)

    @defer.inlineCallbacks
    def smembers(self, key):
        """
        获取指定 key 的值
        :return:set()
        """
        r = yield self.db.smembers(key)
        returnValue(r)

    @defer.inlineCallbacks
    def srem(self, key, members):
        """
        移除集合中一个或多个成员
        :param members:一个或多个member
        """
        r = yield self.db.srem(key, members)
        returnValue(r)

    @defer.inlineCallbacks
    def sismember(self, key, member):
        """
        判断 member 元素是否是集合 key 的成员
        """
        r = yield self.db.sismember(key,member)
        returnValue(r)

    @defer.inlineCallbacks
    def sunion(self, keys, *args):
        """
        获取多个set的交集
        :param keys: key数组
        :return:
        """
        r = yield self.db.sunion(keys, args)
        returnValue(r)

    # other
    @defer.inlineCallbacks
    def expire(self, key, time):
        """
        设置key生命周期
        """
        r = yield self.db.expire(key, time)
        returnValue(r)


def getResult(v):
    print v

# redis_client = Redis()
# redis_client.connect()
# redis_client.getset('ddd',1234).addCallback(getResult)
# redis_client.mset({'ddd':1234,'eee':123,'fff':111}).addCallback(getResult)
# redis_client.srem('settest',[777,234,56]).addCallback(getResult)
# redis_client.smembers('settest').addCallback(getResult)
# redis_client.hset('a','a1',set([1,2,3,4])).addCallback(getResult)
# redis_client.hget('a', 'a1').addCallback(getResult)
# redis_client.sadd('d',set([1,2,3,4,5])).addCallback(getResult)
# reactor.run()
