#!/usr/bin/bash

echo -e "\tiptalk_mysql stopping ..."
docker stop iptalk_mysql > /dev/null 2>&1
docker rm iptalk_mysql > /dev/null 2>&1
echo -e "\tiptalk_mysql stopped."
