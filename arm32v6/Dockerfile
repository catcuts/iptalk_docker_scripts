#############################################################################
# 构建
#     docker build -f <Dockerfile_path> -t <image_name>:<tag> .
#############################################################################

FROM python:2.7.15-alpine3.6

ARG start_script=./start.sh
ARG TZ=Asia/Shanghai
ARG ffmpeg_static=./ffmpeg-release-64bit-static.tar.xz

COPY $start_script /home/pi/start/
ADD $ffmpeg_static /home/pi/pkgs/

RUN \
# change the apt source
    echo 'http://mirrors.aliyun.com/alpine/v3.6/main' > /etc/apk/repositories && \
    echo 'http://mirrors.aliyun.com/alpine/v3.6/community' >>/etc/apk/repositories && \ 

# install all system dependencies
    apk update && apk add \
        gcc \
        git \
        sudo \
        bash \
        make \
        curl \
        unzip \
        python2-dev \
        libffi-dev \
        musl-dev \
        openssl-dev \
        linux-headers \
        mariadb \
        mariadb-client \
        openssh-server && \
    apk del openssl-dev && apk add mariadb-dev && \

# mkdir all will be used
    mkdir -p \
        /home/pi/src \
        /home/pi/tmp/data \
        /home/pi/tmp/settings && \

# correct the time zone
    ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \ 
    echo $TZ > /etc/timezone && \

# fetch and extract the ffmpeg into /home/pi then move to /home/pi/ffmpeg  
    # cd /home/pi/pkgs && \
    # wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz && \
    # tar -Jxf ffmpeg-release-64bit-static.tar.xz && \
    mv /home/pi/pkgs/ffmpeg-3.4.2-64bit-static /home/pi/ffmpeg && \

# install python packages from douban source image
    echo -e 'cffi>=1.10.0\n\
asn1crypto>=0.22.0\n\
astroid>=1.5.3\n\
attrs>=17.2.0\n\
backports.functools-lru-cache>=1.4\n\
bcrypt>=3.1.3\n\
Beaker>=1.8.0\n\
cas-client==0.1.4\n\
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

CMD ["/bin/bash", "/home/pi/start/start.sh"]  # will be replaced if specified cmd when docker run image <cmd>
