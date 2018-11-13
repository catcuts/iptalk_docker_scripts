# -*- coding:utf-8 -*-
from core.logger import log
from twisted.internet.protocol import DatagramProtocol
import struct
import socket
import json
import uuid
from base import ProtocolTransferBase


class UDPProtocolTransfer(ProtocolTransferBase):
    def __init__(self, factory):
        self.factory = factory
        self.transport = factory.transport

    def send_data(self, data):
        self.transport.write(data)

    def send_line(self, data):
        self.transport.sendLine(data)


class UDPFactory(DatagramProtocol):
    def __init__(self, addr=None):
        self.addr = addr

    def send_data(self, data):
        if self.addr is not None:
            self.transport.write(data, self.addr)

    def datagramReceived(self, data, addr):
        if (self.port == 3478 or self.port == 3456):
            int_ip = int(struct.unpack("I", socket.inet_aton(addr[0]))[0])
            re_data = struct.pack("HHI", 0xdead, int(addr[1]), int_ip)
            re_data = re_data[0:2] + re_data[3] + re_data[2] + re_data[4:8]  # 需要大小端转换(同一个局域网)？
            self.transport.write(re_data, addr)
        elif (self.port == 13980):
            print data.encode("hex").upper()
            print struct.unpack("IiIli", data)  # 312D16EF  49 45 22 239
            re_data = struct.pack("IiIli", 3735884340L, 0, 20000022, 3221278645, 15000)
            self.transport.write(re_data, addr)
        elif (self.port == 3550):  # 组播扫描部分
            # print "multicastSearch"  # 测试标记
            length = len(data)
            if length == 584 or length == 1668:
                from devices.iptalk.enrtystruct import DeviceInfo
                from devices.iptalk.subpub import publish
                command = "4I32s32s32s32s64s64s64s64s64s3i64s2i4B32s"
                flag, cmdtype, size, type, device_id, device_ip, device_mask, device_gw, alias, sip_server_ip, server_ip, server_upper, dns, priority, shortOut1def, shortOut2def, mac_addr, audio_port, video_port, record_on_off, set_param1, set_param2, set_param3, version = struct.unpack_from(
                    command, data[:584])
                dict = DeviceInfo(device_id, device_ip, device_mask, device_gw, alias,
                                  sip_server_ip, server_ip, server_upper, dns, priority,
                                  shortOut1def, shortOut2def, mac_addr, audio_port, video_port,
                                  record_on_off, set_param1, set_param2, set_param3, version).get_data()
                theme = "multicastSearch"
                dict['Action'] = theme
                dict['id'] = uuid.uuid4().hex
                self.temp.append(dict)
                data = json.dumps(dict)
                publish.publish(theme, data)
