# -*- coding:utf-8 -*-
import uuid
from settings import Settings


def unicode_string(input, encoding='utf-8'):
    if isinstance(input, unicode):
        return input.encode(encoding)
    else:
        return input


START_VOERKA = 'start' in Settings.get('voerka') and Settings.get('voerka')['start'] == 'true' or False  # 是否启动分布式
SERVER_ID = 'serverID' in Settings.get('voerka') and Settings.get('voerka')['serverID'] or uuid.uuid4().hex  # 服务器ID
SERVER_IP = 'serverIP' in Settings.get('voerka') and Settings.get('voerka')['serverIP']  # 自己的公网IP
TARGET_IP = 'targetIP' in Settings.get('voerka') and Settings.get('voerka')['targetIP'] or None  # 集群任意成员IP，字段不存在则等待别人加入
BALLOTS_INTERVAL = 'ballots_interval' in Settings.get('voerka') and int(
    Settings.get('voerka')['ballots_interval']) or 2  # 选举间隔时间
RE_LOGIN_TIME = 're_login_time' in Settings.get('voerka') and int(
    Settings.get('voerka')['re_login_time']) or 10  # 集群连接失败后n秒重连
BALLOTS_TIMEOUT = 10  # 选举超时时间（选举成功后10秒未完成结束选举）暂未使用
SERVER_ID = unicode_string(SERVER_ID)
SERVER_IP = unicode_string(SERVER_IP)
TARGET_IP = unicode_string(TARGET_IP)
# 端口
port = 5453
# state
FREE = 1  # 空闲
WAIT = 2  # 等待
ROCK = 3  # LOCK锁
PROTOCOL_PAXOS_HEAD_FLAG = 0x55665566
# command
BALLOTS = 0x0101  # 257
AGREE = 0x0102  # 258
DISAGREE = 0x0103  # 259
START = 0x0104  # 260
END = 0x0105  # 261
ORIENTATE = 0x0106  # 262
# action
LOGIN = 0x1001  # 4097
ADD_SERVERS = 0x1002  # 4098
LOGIN_SUCCESS = 0x1003  # 4099
KILL_SERVERS = 0x1004  # 4100


def cut(cls):
    def _wrapper(c, *arg):
        if c.is_login:
            cls(c, *arg)

    return _wrapper


def unicode_string(obj):  # 所有unicode转string
    if isinstance(obj, dict):
        return {unicode_string(key): unicode_string(value) for key, value in obj.iteritems()}
    elif isinstance(obj, list):
        return [unicode_string(element) for element in obj]
    elif isinstance(obj, unicode):
        return obj.encode('utf-8')
    else:
        return obj


from devices.iptalk.paxos.paxostcp import PaxosFactory, PaxosTransfer
from devices.iptalk.paxos.paxoshandler import PaxosHandler
