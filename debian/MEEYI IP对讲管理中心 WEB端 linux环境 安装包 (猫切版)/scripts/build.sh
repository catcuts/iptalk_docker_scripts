#!/usr/bin/bash

docker_file=./Dockerfile
image_id=
# iptalk_src=./iptalk.zip
start_script=./start.sh

while getopts "f:t:i:s:" arg  # 选项后面的冒号表示该选项需要参数
do
    case $arg in
        f)
            docker_file=$OPTARG  # 参数存在 $OPTARG 中
            ;;
        t)
            image_id=$OPTARG
            ;;
        # i)
        #     iptalk_src=$OPTARG
        #     ;;
        s)
            start_script=$OPTARG
            ;;
    esac
done

if [ -z $image_id ]; then
    echo "need image_id !"
    exit 1
fi

echo -e "\tdocker_file: $docker_file\n" \
        "\timage_id   : $image_id\n" \
        "\tbuilding ..."

echo -e "ready to execute: \n\tdocker build -f $docker_file -t $image_id --build-arg start_script=$start_script ."

docker build -f $docker_file -t $image_id \
--build-arg start_script=$start_script .
# --build-arg iptalk_src=$iptalk_src start_script=$start_script .

echo -e "\t$image_id built."