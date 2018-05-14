#############################################################################
# build cmd example
#     docker build -f ./Dockerfile -t meeyi/iptalk:v1.2.rpi3 .
#############################################################################

FROM resin/raspberrypi3-python:2.7.13
MAINTAINER catcuts <liu2066@foxmail.com>

ARG scripts=./scripts
ARG packages=./packages

COPY ./startup.sh /home/pi/
COPY $scripts /home/pi/scripts
COPY $packages /home/pi/packages/

RUN \
    bash /home/pi/scripts/correct_sources.sh && \
    bash /home/pi/scripts/correct_timezone.sh && \
    bash /home/pi/scripts/install_ffmpeg.sh && \
    bash /home/pi/scripts/install_packages.sh && \
    bash /home/pi/scripts/enable_ssh_root.sh

CMD ["bash", "/home/pi/startup.sh"]  # will be replaced if specified cmd when docker run image <cmd>
