# -*- coding:utf-8 -*-
__author__ = 'zhwx'
import os

def get_parent_folder(path):
    return os.path.abspath(path+os.path.sep+"..")
