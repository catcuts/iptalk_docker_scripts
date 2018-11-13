#!/usr/bin/bash
# bash start_iptalk_mysql.sh -c <自定义 mysql 容器名> -d <自定义 mysql 数据存储文件夹> && \
# bash start_iptalk.sh \
# -c <上述 mysql 容器名> \
# -d <自定义 iptalk src 存储文件夹> \
# -n <自定义 iptalk 容器名> \
# -i <iptalk 镜像名> \
# -x <21端口映射> \
# -y <22端口映射>


############ ↓ 修改参数为所需 ↓ ############

# mysql 容器 名称 (默认为 meeyi_mysql_container)
IPTALK_MYSQL=meeyi_mysql_container

# mysql 数据文件夹 路径 (默认为 /home/iptalk/mysql)
MYSQL_DIR=/home/iptalk/mysql

# iptalk 专用文件夹 路径 (默认为 /home/iptalk)
IPTALK_DIR=/home/iptalk

############ ↑ 修改参数为所需 ↑ ############


bash start_iptalk_mysql.sh -c $IPTALK_MYSQL -d $MYSQL_DIR -p 3306

seconds_left=20
while [ $seconds_left -gt 0 ];do
    echo -n "请等待 mysql 配置，还有 ${seconds_left} 秒……"
    # echo -n $seconds_left
    sleep 1
    seconds_left=$(($seconds_left - 1))
    echo -ne "\r                                        \r" #清除本行文字
done

bash start_iptalk.sh -c $IPTALK_MYSQL -d $IPTALK_DIR