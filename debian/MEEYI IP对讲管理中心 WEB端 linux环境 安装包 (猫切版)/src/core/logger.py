# -*- coding:utf-8 -*-
__author__ = 'zhwx'
import logging
from twisted.python.log import FileLogObserver,_safeFormat,textFromEventDict,addObserver
from twisted.python.logfile import DailyLogFile
from twisted.python import util
from twisted.logger import Logger
import os
from settings import Settings
# Logging levels
DEBUG = logging.DEBUG
INFO = logging.INFO
WARNING = logging.WARNING
ERROR = logging.ERROR
CRITICAL = logging.CRITICAL

LEVEL_NAMES = {
    logging.DEBUG: "DEBUG",
    logging.INFO: "INFO",
    logging.WARNING: "WARNING",
    logging.ERROR: "ERROR",
    logging.CRITICAL: "CRITICAL",
}

class LogObserverBase(FileLogObserver):
    def __init__(self, target, level=INFO,output_to_console=True, encoding='utf-8'):
        FileLogObserver.__init__(self, target)
        self.encoding = encoding
        self.logLevel = level
        self.output_to_console=output_to_console
    def emit(self, eventDict):
        if eventDict['isError']:
            level = logging.ERROR
        elif 'level' in eventDict:
            level = eventDict['level']
        elif 'warn' in eventDict["log_level"].name:
            level = logging.WARNING
        elif "debug" in eventDict["log_level"].name:
            level = logging.DEBUG
        else:
            level = logging.INFO
        if level >= self.logLevel:
            text = textFromEventDict(eventDict)
            if text is None:
                return
            timeStr = self.formatTime(eventDict["time"])
            fmtDict = {
                "system": eventDict["system"],
                "text": text.replace("\n", "\n\t"),
                "level":LEVEL_NAMES[level]
            }
            msgStr =_safeFormat("[%(level)s] %(text)s\n", fmtDict)
            util.untilConcludes(self.write, timeStr + " " + msgStr)
            util.untilConcludes(self.flush)
            if self.output_to_console:
                print timeStr + " " + msgStr,


logfile_path=os.path.join(os.path.abspath(os.path.dirname(__file__)+os.path.sep+".."),"data","logs")
addObserver(LogObserverBase( DailyLogFile("log.txt", logfile_path),level=int(Settings.get("log")['level'])).emit)
# addObserver(LogObserverBase( DailyLogFile("log.txt", logfile_path),level=DEBUG if Settings.debug else Settings.get("log",default="INFO")).emit)
class SmartTalkLogger(Logger):
    pass


log=SmartTalkLogger(namespace="smarttalk")
