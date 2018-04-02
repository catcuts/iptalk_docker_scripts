#!/usr/bin/bash

# awk 'BEGIN { cmd="cp -ri /home/pi/tmp/data/* /home/pi/src/data"; print "n" |cmd; }'
# awk 'BEGIN { cmd="cp -ri /home/pi/tmp/settings/* /home/pi/src/settings"; print "n" |cmd; }'

# cp -rn /home/pi/tmp/data/* /home/pi/src/data
# cp -rn /home/pi/tmp/settings/* /home/pi/src/settings

setting_file=/home/pi/src/settings/default.ini

if [[ $MYSQL_HOST ]]; then
    sed -in "s/^host\s*=\s*.*/host = $MYSQL_HOST/" $setting_file
fi

if [[ $MYSQL_PORT ]]; then
    sed -in "s/^port\s*=\s*.*/port = $MYSQL_PORT/" $setting_file
fi

if [[ $IPTALK_DATABASE ]]; then
    sed -in "s/^iptalkdatabase\s*=\s*.*/iptalkdatabase = $IPTALK_DATABASE/" $setting_file
fi

if [[ $MYSQL_USERNAME ]]; then
    sed -in "s/^user\s*=\s*.*/user = $MYSQL_USERNAME/" $setting_file
fi

if [[ $MYSQL_PASSWORD ]]; then
    sed -in "s/^password\s*=\s*.*/password = $MYSQL_PASSWORD/" $setting_file
fi

DATE=$(date +%Y-%m-%d)
echo -e "\n\t\t\t ====== IPTALK RUNNING ======\n\
\n\t\t\t ======   $DATE   ====== \n\t\t\t"

mkdir -p /var/run/sshd > /dev/null && \
/usr/sbin/sshd -D & \
sudo service mysql start > /home/pi/log.txt 2>&1 && \
python /home/pi/src/iptalk.py
