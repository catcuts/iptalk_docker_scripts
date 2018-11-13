# -*- coding:utf-8 -*-
"""
如果更新了权限的字段，需要删除相关的表，再重启服务来重建数据库表
"""
from playhouse.migrate import *
from devices.iptalk.dbmodel import User,Authorization,Authority,Identity
mysql_db = MySQLDatabase('iptalk', user='root', password='root', charset='utf8', host='127.0.0.1')
mysql_db.connect()
table_list = mysql_db.get_tables()
mysql_db.drop_table(User) if "user" in table_list else ""
mysql_db.drop_table(Authorization) if "authorization" in table_list else ""
mysql_db.drop_table(Authority) if "authority" in table_list else ""
mysql_db.drop_table(Identity) if "identity" in table_list else ""
mysql_db.close()