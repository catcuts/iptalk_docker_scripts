#!/usr/bin/bash

echo -e "\tiptalk-mysql stopping ..."
docker stop iptalk-mysql > /dev/null 2>&1
docker rm iptalk-mysql > /dev/null 2>&1
echo -e "\tiptalk-mysql restarting ..."

docker run --name iptalk-mysql \
-v /home/iptalk/mysql:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7 \
--character-set-server=utf8 \
--collation-server=utf8_unicode_ci

echo -e "\tiptalk-mysql restarted."