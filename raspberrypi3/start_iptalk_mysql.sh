#!/usr/bin/bash

# eg.: bash start_iptalk_mysql -c iptalk_mysql -d /home/pi/iptalk/mysql -p 3306

IPTALK_MYSQL=
MYSQL_DIR=
MYSQL_PORT=3306

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
-v $(pwd):/app \
-e MYSQL_DATABASE=admin \
-e MYSQL_USER=pi \
-e MYSQL_PASSWORD=raspberry \
-e MYSQL_ROOT_PASSWORD=root \
-p $MYSQL_PORT:3306 \
-d catcuts/alpine-mysql:latest-alpine3.6

echo -e "\t$IPTALK_MYSQL restarted."