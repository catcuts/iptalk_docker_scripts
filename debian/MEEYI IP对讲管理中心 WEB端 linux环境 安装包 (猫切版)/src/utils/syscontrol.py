#coding = utf8
# -*- coding: utf-8 -*-
''' 
    用法：

        from netSet import *

        systemController = systemControl(command,ip,gateway,netmask,dns_prefer,dns_alter,device)
                                        # 命令  ,ip, 网关  ,子网掩码, 首选dns , 备选dns , 设备(eth0, eth1等，暂不支持无线网卡)
                                        # 命令包括：（只有changeNetwork命令后面需要参数）
                                        #           getNetworkConf  获取网络参数json
                                        #           changeNetwork   修改静态ip
                                        #           restartNetwork  重启网络以生效（同时将重启树莓派）
                                        #           shutdown        关闭树莓派
                                        #           reboot          重启树莓派

        systemController.execute()      # 执行上述指定命令

    TODO：
        1. 错误提示
        2. 重启或关闭linux可能出现需要其他用户确认的情况

        
'''

import sys
import os
import platform
import subprocess
import re
from devices.iptalk.language import language as _

path_dhcpcd_conf = "/etc/dhcpcd.conf" # RaspberryPi网络配置文件路径
path_resolv_conf = "/etc/resolv.conf" # RaspberryPi DNS服务器地址存放文件路径

DEFAULT = {
    "ip": "",
    "gateway": "",
    "netmask": "",
    "dns_prefer": "",
    "dns_alter": "",
}

class systemControl(object):
     
    def __init__(self,command,device="eth0",ip="",gateway="",netmask="",dns_prefer="",dns_alter="",default=None):
        """
        @desc: init
        """
        self.platform = self.getPlatform() 
        self.command = command
        self.ip = ip
        self.gateway = gateway
        self.netmask = netmask
        self.dns_prefer = dns_prefer
        self.dns_alter = dns_alter
        self.device = device
        self.default = default or DEFAULT

    def shutDown(self):
        """
        @attention: shutdown the system
        """
        subprocess.Popen("shutdown -h now", shell=True)
     
    def reboot(self):
        """
        @attention: reboot the system
        """
        from devices.iptalk.monitor import iptalk_rpi_reset_monitor
        iptalk_rpi_reset_monitor.restart_sig = 1
        # subprocess.Popen("shutdown -r now", shell=True)

    def restartNetwork(self):
        """
        @attention: reboot the system
        """
        s = subprocess.Popen("sudo /etc/init.d/networking restart", shell=True)
        s.wait()
        self.reboot() #立即重启生效

    def changeNetwork(self):
        """
        @attention: change the network of the system
        """
        fp = path_dhcpcd_conf
        dev = self.device
        ip = self.ip
        netmask = self.netmask
        gateway = self.gateway
        dns_prefer = self.dns_prefer
        dns_alter = self.dns_alter

        check_error = self.checkFormat()
        
        if check_error:
            result = check_error     
        elif self.platform == "raspbian":

            #  整区匹配 \n[^#]*\s*interface\s(eth0)\s*\n\s*static\sip_address\s*=([^/]*)/(.*)\n\s*static\srouters\s*=(.*)\n\s*(static\sdomain_name_servers\s*=(.*))?\n*
            r_netconf = re.compile("\\n[^#]*interface\\s(" + dev + ")\\s*\\n\\s*static\\sip_address\\s*=(.*)/(.*)\\n\\s*static\\srouters\\s*=(.*)\\n\\s*(static\\sdomain_name_servers\\s*=(.*))?\\n*")

            #  分段匹配
            # r_head = re.compile("[^#]interface\\s*(" + dev + ")\\s*")  #  网卡设备
            # r_ip = re.compile("[^#]\\s*(static\\sip_address=.*)")  # ip地址/子网掩码
            # r_gateway = re.compile("[^#]\\s*(static\srouters=.*)")  # 路由器/网关地址
            # r_dns = re.compile("[^#]\\s*(static\\sdomain_name_servers=.*)")  # dns地址

            # 开始 -> 构造 -> 替换/追加 -> 写入 -> 结束
            # 一个生命周期从开始到结束
            # 每个环节都应该是尽量互相独立的，保证低耦合，高可维护，易扩展
            # 如果需要更新某个环节，则不影响其他环节
            # 如果需要加入某个环节，应继续保证与其他环节独立

            if not (ip or netmask or gateway):  # 重置
                new_netconf = ""
            else:  # 非重置
                #  初始化
                line_head = "interface " + dev
                line_ipnm = " static ip_address=" + ip + "/" + self.codeNetmask(netmask)
                line_gw = " static routers=" + gateway
                if dns_prefer:
                    line_dns = " static domain_name_servers=" + dns_prefer + " " + dns_alter
                else:
                    line_dns = ""

                #  构造新配置区
                new_netconf = "\n\n\n" + "\n".join([line_head, line_ipnm, line_gw, line_dns])

            #  新配置替换原配置
            with open(fp, "r") as f:
                fc = f.read()
                m_netconf = re.search(r_netconf, fc)
                if m_netconf:  # 找到原配置则替换
                    fc = re.sub(r_netconf, new_netconf, fc)
                else:  # 没有原配置则追加
                    fc = fc + new_netconf

            #  写入配置文件
            with open(fp, "w") as f:
                f.write(fc)

            #result = commands.getoutput("sudo ifdown %s && sudo ifup %s" %(self.device,self.device))
            result = "ok"

        elif self.platform == "windows":
            result = "ok"
            import wmi
            import pythoncom
            pythoncom.CoInitialize()
            wmiService = wmi.WMI()
            colNicConfigs = wmiService.Win32_NetworkAdapterConfiguration(IPEnabled=True)
            if len(colNicConfigs):
                objNicConfig = colNicConfigs[0]
                arrIPAddresses = [ip]
                arrSubnetMasks = [netmask]
                arrDefaultGateways = [gateway]
                arrGatewayCostMetrics = [1]
                arrDNSServers = []
                if dns_prefer:
                    arrDNSServers.append(dns_prefer)
                    if dns_alter:
                        arrDNSServers.append(dns_alter)
                intReboot = 0
                # 复位 ip / nm / gw
                if not ip and not netmask and not gateway:  # 三个都为空，则为重置
                    objNicConfig.EnableDHCP()
                    result = "ok"
                # 不设置
                elif not ip or not netmask or not gateway:  # 有一个为空，则不设置
                    result = "ok"
                # 设置 ip /nm /gw
                else:  # WMI 认为 三个都为空则设置失败 
                    returnValue = objNicConfig.EnableStatic(IPAddress = arrIPAddresses, SubnetMask = arrSubnetMasks)
                    if not (returnValue[0] == 0):
                        result = 'error: IP和子网掩码修改失败'

                    returnValue = objNicConfig.SetGateways(DefaultIPGateway = arrDefaultGateways, GatewayCostMetric = arrGatewayCostMetrics)
                    if not (returnValue[0] == 0):
                        result = 'error: 网关修改失败'

                # 设置 / 复位 dns
                returnValue = objNicConfig.SetDNSServerSearchOrder(DNSServerSearchOrder = arrDNSServers)
                if not (returnValue[0] == 0):
                    result = 'error: DNS修改失败'
            else:
                result = "error: 获取网卡失败"
        else:
            result = "error: 不支持的平台: " + self.platform

        print(result)
        return result

    def resetNetwork(self):
        self.command = "changeNetwork"
        self.ip = self.default["ip"]
        self.gateway = self.default["gateway"]
        self.netmask = self.default["netmask"]
        self.dns_prefer = self.default["dns_prefer"]
        self.dns_alter = self.default["dns_alter"]
        return self.changeNetwork()

    def getNetworkConf(self):
        """
        @desc: get network config json object
        """
        if self.platform == "raspbian":
            # 获取默认网关
            s1 = subprocess.Popen("ip route", shell=True, stdout=subprocess.PIPE)
            lines = s1.communicate()[0].decode().split("\n")
            networkConf = {}
                #finally we can have networkConf like:
                    #{
                    #   eth0: { gateway:"...", ip:"...", netmask:"..."},
                    #   wlan0: { gateway:"...", ip:"...", netmask:"..."},
                    #   ...
                    #}
            # 获取ip地址、子网掩码、默认网关
            for line in lines: 
                if "default via" in line: #某设备默认网络参数
                    m = re.search(r"default\svia\s(\d+\.\d+\.\d+\.\d+)\sdev\s(\w+)\s", line)
                    if m: #每一组都是都是必选的，如果匹配到，说明组内都不为空
                        m = list(map(lambda x:x.encode("utf-8"), m.groups()))
                        networkConf[m[1]] = {} #默认网关对一个设备只有一个，所以识别到就是新值
                        networkConf[m[1]]["gateway"] = m[0] #example: { eth0: { gateway: '192.168.8.1'. }, }
            #     elif line:
            #         m = re.search(r"(\d+\.\d+\.\d+\.\d+)(\/\d+)*\sdev\s(\w+)\s", line)
            #         if m: #同上
            #             m = list(map(lambda x:x.encode("utf-8"), m.groups()))
            #             try:
            #                 networkConf[m[2]] #因为这个设备可能已经有一些json了，先试试有没有
            #             except:
            #                 networkConf[m[2]] = {} #没有就赋空
            #             networkConf[m[2]]["ip"] = m[0]
            #             networkConf[m[2]]["netmask"] = self.decodeNetmask(m[1])
            #             dev = m[2]

            # 获取 ip 地址和子网掩码
            s2 = subprocess.Popen("ifconfig", shell=True, stdout=subprocess.PIPE)
            network_drive_info = s2.communicate()[0].decode().split("\n" + " " * 10)  # eth0
            m_dev = re.search(r"^(.+)\s{6}", network_drive_info[0])
            if m_dev:
                dev = m_dev.group(1)
                m_netConf = re.search(r"inet\saddr:(\d+\.\d+\.\d+\.\d+).+Mask:(\d+\.\d+\.\d+\.\d+)", network_drive_info[1])
                networkConf[dev]["ip"] = m_netConf.group(1)
                networkConf[dev]["netmask"] = m_netConf.group(2)

            #获取dns服务器地址
            networkConf[dev]["dns_prefer"] = ""
            networkConf[dev]["dns_alter"] = ""
            with open(path_resolv_conf, "r") as f:
                dnsPattern = re.compile("nameserver\s(\d+\.\d+\.\d+\.\d+)\s*(?:\nnameserver\s(\d+\.\d+\.\d+\.\d+)*\s*)*")
                fc = f.read()
                m = dnsPattern.search(fc)
                if m and dev:
                    networkConf[dev]["dns_prefer"] = m.groups()[0] #这个是必选匹配，如果匹配不到，就根本不会if m
                    networkConf[dev]["dns_alter"] = m.groups()[1] #这个是可选匹配，如果匹配不到，则为""
            #读取文件结束

        elif self.platform == "windows":
            import wmi
            import pythoncom
            pythoncom.CoInitialize()
            wmiService = wmi.WMI()
            colNicConfigs = wmiService.Win32_NetworkAdapterConfiguration(IPEnabled=True)
            if len(colNicConfigs):
                objNicConfig = colNicConfigs[0]
                netconf = {}
                netconf[_("网络设置")] = {"ip": "", "nm": "", "gw": "", "dns_prefer": "", "dns_alter": ""}
                netconf[_("网络设置")]["ip"] = objNicConfig.IPAddress[0]
                netconf[_("网络设置")]["netmask"] = objNicConfig.IPSubnet[0]
                netconf[_("网络设置")]["gateway"] = objNicConfig.DefaultIPGateway[0]
                netconf[_("网络设置")]["dns_prefer"] = objNicConfig.DNSServerSearchOrder[0]
                netconf[_("网络设置")]["dns_alter"] = objNicConfig.DNSServerSearchOrder[1] if len(objNicConfig.DNSServerSearchOrder) > 1 else ""
                return netconf
            else:
                networkConf = ""
        else:
            networkConf = ""
        print(networkConf)
        return networkConf

    def execute(self):
        if self.command == "shutdown":
            self.shutDown()
        elif self.command == "reboot":
            self.reboot()
        elif self.command == "changeNetwork":
            return self.changeNetwork() #返回ok或错误信息
        elif self.command == "restartNetwork":
            self.restartNetwork()
        elif self.command == "getNetworkConf":
            return self.getNetworkConf() #返回json object
        elif self.command == "resetNetwork":
            return self.resetNetwork()
        elif self.command.startswith("getNetworkTime:"): #则把command冒号后面的字符串当成请求url get network time
            return self.getNetworkTime()
        else:
            print("error: 不支持的命令: " + self.command)
            return False
     
    def getPlatform(self):
        """
        @attention: get the platform of the system
        """
        try:
            platForm = platform.platform().lower()
            if "ubuntu" in platForm:
                currentPlatForm = "ubuntu"
            elif "centos" in platForm:
                currentPlatForm = "centos"
            elif "debian" in platForm:
                if self.isRaspbian():
                    currentPlatForm = "raspbian"
                else:
                    currentPlatForm = "debian"
            elif "windows" in platForm:
                currentPlatForm = "windows"
            else:
                currentPlatForm = "unsupported"
        except:
            currentPlatForm = "unknown"

        print("platForm: " + currentPlatForm)
        return currentPlatForm
    
    def isRaspbian(self):
        """
        @attention: check if the platform of the system is raspbian
        """  
        s = subprocess.Popen("head -n 1 /etc/issue", shell=True, stdout=subprocess.PIPE)
        return "raspbian" in s.communicate()[0].decode().lower()

    def codeNetmask(self,netmask):
        """
        @attention: code netmask to part of ip formated like 192.168.0.103/24.
                    return '24'(in this example) or ''(no set)
        """ 
        netmask_parts = netmask.split(".")
        code = 0
        try:
            for part in netmask_parts:
                code += bin(int(part)).count("1")
            code = str(code)
        except:
            code = ""
        return str(code)

    def decodeNetmask(self,code):
        """
        @attention: decode code to netmask.
        """ 
        code = code.replace("/","")
        code = "1"*int(code) + "0"*(32-len(code))
        netmask = ""
        if code:
            for i in range(0,4):
                netmask = netmask + str(int(code[i*8:i*8+8], 2)) + "."
        netmask = netmask[:-1]
        return netmask

    def checkFormat(self):
        error_format = "error: 无效的格式"
        reset = True if not self.ip and not self.gateway and not self.netmask else False
        if reset:
            return False
        if not (self.ip and self.gateway and self.netmask):  # 三个有一个为空 （三个都为空时，则为重置）
            if not self.ip: return "error: IP地址不能为空"
            if not self.gateway: return "error: 网关不能为空"
            if not self.netmask: return "error: 子网掩码不能为空"
        checkee = '_'.join([self.ip, self.gateway, self.netmask])
        print("checkee: %s" %checkee)
        if not re.search(r"(_*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})_*){3}", checkee):
            return error_format
        if self.dns_prefer and not re.search(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", self.dns_prefer):
            return error_format
        if self.dns_alter and not re.search(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", self.dns_alter):
            return error_format
        return False

    def getNetworkTime(self):
        url = re.sub("^getNetworkTime:\s*", "", self.command)

if __name__ == "__main__":
    """"
    @param: <shutdown/reboot> 
            <changeNetwork>,<device>,<ip>,<gateway>,<netmask>,<dns_prefer>,<dns_alter>
    """
    command = sys.argv[1]
    if command == "changeNetwork":
        try:
            device = sys.argv[2]
        except:
            print("device unspecified!")
    else:
        device = ""

    try:
        ip = sys.argv[3]
        gateway = sys.argv[4]
        netmask = sys.argv[5]
        dns_prefer = sys.argv[6]
        dns_alter = sys.argv[7]
        
    except:
        ip = ""
        gateway = ""
        netmask = ""
        dns_prefer = ""
        dns_alter = ""

    systemController = systemControl(command,device,ip,gateway,netmask,dns_prefer,dns_alter)
    systemController.execute()
