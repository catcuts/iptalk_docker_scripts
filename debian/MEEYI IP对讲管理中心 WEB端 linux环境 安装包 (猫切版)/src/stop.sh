# bash /home/pi/src/stop.sh
pgrep -f test.py
if [ $? -eq 0 ]
then 
    echo "iptalk stopping ..." && \
    pid=`pgrep -f test.py` && \
    sudo kill -9 $pid && \
    echo "iptalk stopped."
fi
echo "system reboot ..."
sudo shutdown -r now
