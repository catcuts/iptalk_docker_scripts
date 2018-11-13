# -*- coding:utf-8 -*-
"""
    数据库表字段新增、删除、重命名等操作
    新用户第一次使用无需用到该功能
"""
from playhouse.migrate import *

mysql_db = MySQLDatabase('iptalk', user='root', password='root', charset='utf8', host='127.0.0.1')
migrator = MySQLMigrator(mysql_db)

temp_field = CharField(null=True)
temp_field_1 = IntegerField(null=True)

migrate(
    migrator.add_column('Device', 'Longitude', temp_field),
    migrator.add_column('Device', 'Latitude', temp_field),
    migrator.add_column('Log_Call', 'CallTimeStamp', temp_field_1)
    # migrator.drop_column('Device', 'Longitude')
    # migrator.rename_column('OwnerDevice', 'sss', 'ttt'),
)

mysql_db.close()
