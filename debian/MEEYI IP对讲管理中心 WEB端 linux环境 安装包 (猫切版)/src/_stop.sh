# bash /home/pi/src/stop.sh
pgrep -f iptalk.py
if [ $? -eq 0 ]
then 
    echo "iptalk stopping ..." && \
    pid=`pgrep -f iptalk.py` && \
    sudo kill -9 $pid && \
    echo "iptalk stopped."
fi
echo "system reboot ..."
#sudo shutdown -r now
