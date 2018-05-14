#!/usr/bin/bash

IPTALK_MYSQL=
IPTALK_DIR=
IPTALK_NAME=iptalk
IPTALK_IMG=meeyi/iptalk:v1.2
MYSQL_PORT=3306

FTP_PORT=21
SSH_PORT=22

while getopts "c:d:n:i:x:y:" arg  # 选项后面的冒号表示该选项需要参数
do
    case $arg in
        c)
            IPTALK_MYSQL=$OPTARG  # 参数存在 $OPTARG 中
            ;;
        d)
            IPTALK_DIR=$OPTARG
            ;;
        n)
            IPTALK_NAME=$OPTARG
            ;;
        i)
            IPTALK_IMG=$OPTARG
            ;;
        x)
            FTP_PORT=$OPTARG
            ;;
        y)
            SSH_PORT=$OPTARG
            ;;
        p)
            MYSQL_PORT=$OPTARG
            ;;
    esac
done

if [ -z "$IPTALK_MYSQL" -o -z "$IPTALK_DIR" ]; then
    echo -e "必要参数：-c <自定义 mysql 容器名> -d <自定义 mysql 数据存储文件夹>"
    exit
fi

docker ps > /dev/null
if [ $? -ne 0 ]
then
    echo -e "\tdocker service is starting ..."
    service docker start
    echo -e "\tdocker service started."
fi && \
echo -e "\t$IPTALK_NAME stopping ..."
docker stop $IPTALK_NAME > /dev/null 2>&1
docker rm $IPTALK_NAME > /dev/null 2>&1
echo -e "\t$IPTALK_NAME restarting ..."
docker run -it \
-p $FTP_PORT:21 \
-p $SSH_PORT:22 \
-p 85:85 \
-p 89:89 \
-p 90:90 \
-p 3456:3456 \
-p 3478:3478 \
-p 3550:3550 \
-p 12200:12200 \
-p 12345:12345 \
-p 13980:13980 \
-p 34952:34952 \
-p 34955:34955 \
-v $IPTALK_DIR/scripts:/home/pi/start \
-v $IPTALK_DIR/src:/home/pi/src \
-e MYSQL_HOST=$IPTALK_MYSQL \
-e MYSQL_PORT=$MYSQL_PORT \
-e MYSQL_USERNAME=root \
-e MYSQL_PASSWORD=root \
--link $IPTALK_MYSQL \
--name $IPTALK_NAME $IPTALK_IMG