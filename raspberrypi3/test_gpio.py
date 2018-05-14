# -*- coding:utf-8 -*-

import time
import RPi.GPIO as GPIO

class IPTalkRPiResetMonitor:
    def __init__(self):
        self.channel_reset = 13
        self.channel_restart = 33
        self.channel_tip = 29
        self.restart_sig = 0
        self.stop_sig = 0
        self.cmds = []
        self.watching = False

    def start(self):
        self.watching = True
        GPIO.setmode(GPIO.BOARD)  # 设置引脚编号规则
        GPIO.setup([self.channel_reset, self.channel_restart, self.channel_tip], GPIO.OUT)
        GPIO.output([self.channel_reset, self.channel_restart, self.channel_tip], GPIO.HIGH)

        print "初始引脚状态：" \
        "\n\t%s 号引脚(复位)：%s" \
        "\n\t%s 号引脚(重启)：%s" \
        "\n\t%s 号引脚(提示)：%s" % (
            self.channel_reset, GPIO.input(self.channel_reset),
            self.channel_restart, GPIO.input(self.channel_restart),
            self.channel_tip, GPIO.input(self.channel_tip))
    
    def stop(self):
        GPIO.cleanup()  # 程序的最后别忘记清除所有资源

iptalk_rpi_reset_monitor = IPTalkRPiResetMonitor()
iptalk_rpi_reset_monitor.start()
time.sleep(5)
iptalk_rpi_reset_monitor.stop()
print "stopped"