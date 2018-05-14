#!/usr/bin/bash

bash start_iptalk_mysql.sh -c <自定义 mysql 容器名> -d <自定义 mysql 数据存储文件夹> && \
bash start_iptalk.sh \
-c <上述 mysql 容器名> \ 
-d <自定义 iptalk 源码存储文件夹> \
-n <自定义 iptalk 容器名> \
-i <iptalk 镜像名> \
-x <21端口映射> \
-y <22端口映射> 