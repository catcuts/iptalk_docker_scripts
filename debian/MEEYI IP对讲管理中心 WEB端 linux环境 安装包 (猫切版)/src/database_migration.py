# -*- coding:utf-8 -*-
import pypyodbc
import os
import MySQLdb
import uuid
from settings import Settings
from devices.iptalk.dbmodel import DeviceTree

setting = Settings.get("database")
connection_string = 'Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=%s\\wr930.mdb;PWD=zhwr' % (
    os.getcwd())
mysql_conn = MySQLdb.connect(host='host' in setting and setting['host'] or '127.0.0.1', user=setting['user'],
                             passwd=setting['password'], db=setting['iptalkdatabase'],
                             charset='charset' in setting and setting['charset'] or 'utf8',
                             port='port' in setting and int(setting['port']) or 3306)
access_conn = pypyodbc.win_connect_mdb(connection_string)
# access_conn = pypyodbc.connect(connection_string)
temp = {0: 'custom'}  # 用来保存tblGroup表和DeviceTree表的主键对应关系


def deal_wchar(string):
    return string.split('\0\0')[0].replace('\0', '')


def charsToLong(string):
    try:
        if type(string) == str or type(string) == unicode:
            return long(deal_wchar(string))
        else:
            return string
    except:
        return None


def isMikeOrTerminal(device_id):
    if type(device_id) == str:
        device_id = charsToLong(device_id)
    if type(device_id) == unicode:
        device_id = int(device_id)
    if device_id >= 20000000 and device_id < 30000000:
        return True
    elif device_id >= 10000000 and device_id < 20000000:
        return False
    else:
        return None


def createDeviceTreeNode(id, pid, **kwargs):
    p_node = DeviceTree.get(DeviceTree.id == pid)
    node = DeviceTree(id=id, **kwargs)
    DeviceTree.add_node(node, p_node)


def moveDeviceTreeNode(dev_id, pid):
    node = DeviceTree.get(DeviceTree.targetId == dev_id)
    target_node = DeviceTree.get(DeviceTree.id == pid)
    node.move_to(target_node)


def buildDeviceTreeNodeFromTblGroup():
    access_cur = access_conn.cursor()
    access_cur.execute('select * from tblGroup order by ParentGroupID')  # 按pid排序，广度优先遍历
    count = 0
    for row in access_cur.fetchall():
        try:
            try:
                node = DeviceTree.get(DeviceTree.name == row[1])  # 如果没有抛异常，表示该节点已经存在
                if node is not None and row[2] in temp and node.parent.id != temp[row[2]]:
                    raise
            except Exception as E:
                id = uuid.uuid4().hex
                temp[row[0]] = id
                name = row[1]
                pid = temp[row[2]]
                createDeviceTreeNode(id, pid, name=name, type=1)
                count += 1
            # createDeviceTreeNode(id, pid, name=name, type=1)
            # count += 1
        except Exception, e:
            print "一行无效数据,GroupID:%s" % (row[0])
    else:
        print "DeviceTree受影响的行: %i" % (count)
        access_cur.close()


def updateDeviceFromTblDevice():
    access_cur = access_conn.cursor()
    access_cur.execute('select DeviceNum,DeviceName,GroupID from tblDevice')
    mysql_cur = mysql_conn.cursor()
    count = 0
    for row in access_cur.fetchall():  # 记录
        try:
            dev_id = row[0].encode("ascii")
            dev_alias = row[1].encode("utf-8")
            num = mysql_cur.execute('select * from device where DevID="%s"' % dev_id)
            if num > 0:
                if mysql_cur.fetchone()[6].encode('utf-8') != dev_alias:
                    impact_num = mysql_cur.execute("update device set Alias ='%s' where DevID='%s'" % (dev_alias, dev_id))
                    mysql_conn.commit()
                pid = temp.get(row[2], "")
                if pid != "":
                    count += num
                    moveDeviceTreeNode(row[0], pid)
            else:
                mysql_cur = mysql_conn.cursor()
                if isMikeOrTerminal(dev_id):
                    mysql_cur.execute("insert into  device (ID,DevID,Register,Alias)values('%s','%s',%d,'%s')" % (
                        uuid.uuid4().hex, str(dev_id), 1, dev_alias))
                else:
                    mysql_cur.execute("insert into  device (ID,DevID,Register,Alias)values('%s','%s',%d,'%s')" % (
                        uuid.uuid4().hex, str(dev_id), 1, dev_alias))
                    mysql_cur.execute(
                        "insert into  devicepanel (ID,DevID)values('%s','%s')" % (uuid.uuid4().hex, str(dev_id)))
                    mysql_cur.execute(
                        "insert into  deviceio (ID,DevID)values('%s','%s')" % (uuid.uuid4().hex, str(dev_id)))
                    mysql_cur.execute(
                        "insert into  deviceaudiovideo (ID,DevID)values('%s','%s')" % (uuid.uuid4().hex, str(dev_id)))
                    mysql_cur.execute(
                        "insert into  devicealarm (ID,DevID)values('%s','%s')" % (uuid.uuid4().hex, str(dev_id)))
                mysql_conn.commit()
                id = uuid.uuid4().hex
                pid = temp[row[2]]
                buf = str(dev_id)
                createDeviceTreeNode(id, pid, targetId=buf, type=4)
                count += 1
        except Exception, e:
            print "一行无效数据,GroupID:%s" % (row[2])
    else:
        print "Device受影响的行: %i" % (count)
        access_cur.close()
        access_conn.close()
        mysql_cur.close()
        mysql_conn.close()

# 设备树要有基础元素，比如root、custom、new节点。设备表和设备树要同时执行，不能单独执行

buildDeviceTreeNodeFromTblGroup()
updateDeviceFromTblDevice()

