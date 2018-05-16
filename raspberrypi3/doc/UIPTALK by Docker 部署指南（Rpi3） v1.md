# UIPTALK by Docker 部署指南（Rpi3） v1

1. 安装 docker
2. 测试 docker 安装成功
3. 拉取 mysql 镜像：catcuts/mysql:latest
4. 拉取 iptalk 镜像：meeyi/iptalk:v1.2.rpi3
5. 运行 start_iptalk_system.sh 并测试
6. 测试成功。编辑 /etc/rc.local exit 0 前添加一行：bash start_iptalk_system.sh

**注：如有错误，不应放过。**