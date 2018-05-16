#!/usr/bin/bash

pid=`pgrep -f iptalk.py` && \
if [[ $pid ]]
then
    echo "iptalk stopping ..." && \
    sudo kill -9 $pid && \
    echo "iptalk stopped."
fi && \
docker stop iptalk > /dev/null 2>&1
docker rm iptalk > /dev/null 2>&1
