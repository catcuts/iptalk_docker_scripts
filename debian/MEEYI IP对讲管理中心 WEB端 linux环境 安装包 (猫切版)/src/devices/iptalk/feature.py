# -*- coding:utf-8 -*-
"""
    本模块用来定义该设备的协议特征
    支持两种模式定义：

    1、定义特征标识
    当协议采用简单匹配模式时，可以定义一个PROTOCOL_FEATURE
    两者只能选择一个
    这样采用默认方式进行匹配处理

    2、定义一个ProtocolFeatureBase的派出类，然后重载is_matched方法进行特征识别
"""
__author__ = 'zhwx'
import struct
from core.protocol.common import CommonDeviceProtocolFeature
PROTOCOL_COMMAND_HEAD_FLAG = 0xabcd1234L
PROTOCOL_QUERY_HEAD_FLAG = 0x6666AAAAL
PROTOCOL_HUIFANG_HEAD_FLAG = 0xFF0101FA  # '\xfa\x01\x01\xff'
PROTOCOL_HUIFANG_LOGIN_HEAD_FLAG = 35981306  # '\xfa\x07%\x02'


# 特征标识
class IPTalkFeature(CommonDeviceProtocolFeature):
    def is_matched(self, data, binary=False):
        try:
            flag = struct.unpack("I", data[0:4])[0]
        except:
            return False
        if flag == PROTOCOL_COMMAND_HEAD_FLAG or flag == PROTOCOL_QUERY_HEAD_FLAG or flag == PROTOCOL_HUIFANG_HEAD_FLAG or flag == PROTOCOL_HUIFANG_LOGIN_HEAD_FLAG:
            return True
        return False

# PROTOCOL_FEATURE = {"type": "", "feature": {}}
