#!/usr/bin/bash

############ ↓ 修改参数为所需 ↓ ############

# mysql 容器 名称 (默认为 meeyi_mysql_container)
IPTALK_MYSQL=meeyi_mysql_container

# mysql 数据文件夹 路径 (默认为 /home/iptalk/mysql)
MYSQL_DIR=/home/iptalk/mysql

# mysql 端口号 (默认为 3306)
MYSQL_PORT=3306

############ ↑ 修改参数为所需 ↑ ############


while getopts "c:d:p:" arg  # 选项后面的冒号表示该选项需要参数
do
    case $arg in
        c)
            IPTALK_MYSQL=$OPTARG  # 参数存在 $OPTARG 中
            ;;
        d)
            MYSQL_DIR=$OPTARG
            ;;
        p)
            MYSQL_PORT=$OPTARG
            ;;
    esac
done

if [ -z "$IPTALK_MYSQL" -o -z "$MYSQL_DIR" ]; then
    echo -e "必要参数：-c <自定义 mysql 容器名> -d <自定义 mysql 数据存储文件夹>"
    exit
fi

echo -e "\t$IPTALK_MYSQL stopping ..."
docker stop $IPTALK_MYSQL > /dev/null 2>&1
docker rm $IPTALK_MYSQL > /dev/null 2>&1
echo -e "\t$IPTALK_MYSQL restarting ..."

docker run --name $IPTALK_MYSQL \
-v $MYSQL_DIR:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-p $MYSQL_PORT:3306 \
-d mysql:5.7 \
--character-set-server=utf8 \
--collation-server=utf8_unicode_ci

echo -e "\t$IPTALK_MYSQL restarted."