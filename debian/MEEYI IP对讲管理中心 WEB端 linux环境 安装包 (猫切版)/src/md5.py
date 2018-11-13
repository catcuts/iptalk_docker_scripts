# -*- coding:utf-8 -*-
import hashlib
import os, sys


# 简单的测试一个字符串的MD5值
def GetStrMd5(src):
    m0 = hashlib.md5()
    m0.update(src)
    print m0.hexdigest()
    pass


# 大文件的MD5值
def GetFileMd5(filename):
    if not os.path.isfile(filename):
        return
    myhash = hashlib.md5()
    f = file(filename, 'rb')
    while True:
        b = f.read(8096)
        if not b:
            break
        myhash.update(b)
    f.close()
    print myhash.hexdigest()
    print type(myhash.hexdigest())
    return myhash.hexdigest()


def CalcSha1(filepath):
    with open(filepath, 'rb') as f:
        sha1obj = hashlib.sha1()
        sha1obj.update(f.read())
        hash = sha1obj.hexdigest()
        print(hash)
        return hash


def CalcMD5(filepath):
    with open(filepath, 'rb') as f:
        md5obj = hashlib.md5()
        md5obj.update(f.read())
        hash = md5obj.hexdigest()
        return hash


GetFileMd5('C:/Users/123/Desktop/UIPTalk_V02.05.0066.11_ZDX1_20170701.dd')
