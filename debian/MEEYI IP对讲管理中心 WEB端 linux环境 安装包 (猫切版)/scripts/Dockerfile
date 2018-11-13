#############################################################################
# 最终运行:
#     启动:
#         docker run \
#         --name=<container_name> \
#         --link=<mysql_container_name> \
#         -p <host_ports>:<container_ports> \
#         [-d | -it] \
#         [-e MYSQL_HOST=<mysql_host>] \
#         [-e MYSQL_PORT=<mysql_port>] \
#         [-e IPTALK_DATABASE=<iptalk_db_name>] \
#         [-e MYSQL_USERNAME=<mysql_username>] \
#         [-e MYSQL_PASSWORD=<mysql_password>] \
#         [-v /path@host/to/settings_folder:/home/pi/src/settings] \
#         [-v /path@host/to/data_folder:/home/pi/src/data]
#         <image_name:tag>
#         # extra_commands is not allowed
#     示例:
#         docker run -it \
#         -p 21:21 \
#         -p 10022:22 \
#         -p 85:85 \
#         -p 89:89 \
#         -p 90:90 \
#         -p 3456:3456 \
#         -p 3478:3478 \
#         -p 3550:3550 \
#         -p 12200:12200 \
#         -p 12345:12345 \
#         -p 13980:13980 \
#         -p 34952:34952 \
#         -p 34955:34955 \
#         --link rdcenter-mysql --name iptalk \
#         -v /home/iptalk/settings:/home/pi/src/settings \
#         -v /home/iptalk/data:/home/pi/src/data \
#         iptalk:latest
#     停止:
#         docker stop <container_name>
#         docker rm <container_name>
# 构建
#     docker build -f <Dockerfile_path> -t <image_name>:<tag>
#############################################################################

FROM debian:latest

ARG iptalk_src=./iptalk.zip
ARG start_script=./start.sh
ARG TZ=Asia/Shanghai
ARG ffmpeg_static=./ffmpeg-release-64bit-static.tar.xz

# ENV \
#     MYSQL_HOST="127.0.0.1" \
#     MYSQL_PORT=3306 \
#     IPTALK_DATABASE="iptalk" \
#     MYSQL_USERNAME="root" \
#     MYSQL_PASSWORD="root"

# COPY $iptalk_src /home/pi/
COPY $start_script /home/pi/start/
ADD $ffmpeg_static /home/pi/pkgs/

RUN \
# change the apt source
    cp /etc/apt/sources.list /etc/apt/sources.list.bkup && \
    sed -i "1i\
deb http://mirrors.aliyun.com/debian/ jessie main non-free contrib\n\
deb http://mirrors.aliyun.com/debian/ jessie-proposed-updates main non-free contrib\n\
deb-src http://mirrors.aliyun.com/debian/ jessie main non-free contrib\n\
deb-src http://mirrors.aliyun.com/debian/ jessie-proposed-updates main non-free contrib" \
    /etc/apt/sources.list  && \

# install all system dependencies
    apt-get update && apt-get install -y \
        gcc \
        sudo \
        git \
        curl \ 
        wget \
        unzip \
        python \
        ntpdate \ 
        python-dev \
        libffi-dev \
        libssl-dev \
        mysql-server \
        mysql-client \
        openssh-server \
        default-libmysqlclient-dev && \

# mkdir all will be used
    mkdir -p \
        /home/pi/src \
        /home/pi/tmp/data \
        /home/pi/tmp/settings && \

# correct the time zone
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    # echo "TZ='Asia/Shanghai'; export TZ" >> /root/.profile && \
    # sudo timedatectl set-timezone Asia/Chongqing && \

# fetch and extract the ffmpeg into /home/pi then move to /home/pi/ffmpeg  
    # cd /home/pi/pkgs && \
    # wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz && \
    # tar -Jxf ffmpeg-release-64bit-static.tar.xz && \
    mv /home/pi/pkgs/ffmpeg-3.4.2-64bit-static /home/pi/ffmpeg && \

# install python packages
    # install pip alongwith setup-tools
        cd /home/pi/pkgs && \
        wget https://bootstrap.pypa.io/get-pip.py && \
        python get-pip.py && \

# install python packages from douban source image
    echo 'cffi>=1.10.0\n\
        asn1crypto>=0.22.0\n\
        astroid>=1.5.3\n\
        attrs>=17.2.0\n\
        backports.functools-lru-cache>=1.4\n\
        bcrypt>=3.1.3\n\
        Beaker>=1.8.0\n\
        cas_client==0.1.4\n\
        colorama>=0.3.9\n\
        configobj>=5.0.6\n\
        configparser>=3.5.0\n\
        cryptography>=2.0.3\n\
        enum34>=1.1.6\n\
        funcsigs>=1.0.2\n\
        idna>=2.5\n\
        igetui>=4.0.3\n\
        ipaddress>=1.0.18\n\
        isort>=4.2.15\n\
        lazy-object-proxy>=1.3.1\n\
        m3u8-generator>=1.5\n\
        mccabe>=0.6.1\n\
        MySQL-python>=1.2.5\n\
        optionaldict>=0.1.1\n\
        peewee==2.10.2\n\
        pyasn1>=0.3.2\n\
        pyasn1-modules>=0.0.9\n\
        pycparser>=2.18\n\
        PyNaCl>=1.1.2\n\
        paramiko>=2.2.1\n\
        pyOpenSSL>=17.0.0\n\
        python-dateutil>=2.5.3\n\
        requests>=2.10.0\n\
        singledispatch>=3.4.0.3\n\
        six>=1.10.0\n\
        service-identity>=17.0.0\n\
        Twisted>=16.3.0\n\
        TwistedWebsocket>=0.0.7\n\
        virtualenv>=15.1.0\n\
        wechatpy>=1.2.13\n\
        wrapt>=1.10.8\n\
        xlwt>=1.2.0\n\
        xmltodict>=0.10.2\n\
        zope.interface>=4.2.0' | while read pkg; \
    do \
        pip install $pkg -i http://pypi.douban.com/simple --trusted-host pypi.douban.com; \
    done

# extract iptalk server code into /home/pi/src
    # unzip /home/pi/iptalk.zip -d /home/pi/src && \
    # cp /home/pi/src/data/* /home/pi/tmp/data && \
    # cp /home/pi/src/settings/* /home/pi/tmp/settings

# volume data file to anonyous
# VOLUME /home/pi/src/data
# VOLUME /home/pi/src/settings

CMD ["bash", "/home/pi/start/start.sh"]  # will be replaced if specified cmd when docker run image <cmd>
