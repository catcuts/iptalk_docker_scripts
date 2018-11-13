# UIPTALK by Docker 部署指南（Linux but not Rpi） v2

  * [一、准备](#一、准备)
  * [二、运行 MySQL 容器](#二、运行-MySQL-容器)
  * [三、运行 IPTalk 容器](#三、运行-IPTalk-容器)
  * [四、测试](#四、测试)
  * [五、设置开机启动](#五、设置开机启动)
  * [六、常见问题](#六、常见问题)

___

## <span style='color: #dd4b39;'>一、准备</span>
**注：如果下述文件夹已存在，则指定一个可用的文件夹名，或者移除或重命名已存在的同名文件夹**  
1. 新建 `iptalk` 专用文件夹：`sudo mkdir -p /home/iptalk`  
2. 移入 `iptalk` 源码文件夹：用 `FileZilla` 或其它方式将 `src` 移入 `/home/iptalk` 下  
3. 移入 `iptalk` 部署和运行脚本：用 `FileZilla` 或其它方式将 `scripts` 移入 `/home/iptalk` 下  
4. 新建 `mysql` 数据存储文件夹：`sudo mkdir -p /home/iptalk/mysql`  

注：  
- `src` 从 `开发者` 那里获得  
- `scripts` 从 `本安装包` 中获得  
- `FileZilla` 如果还没安装，从 [这里](https://filezilla-project.org/download.php?platform=win64) 下载符合所在系统的安装程序

___

## <span style='color: #dd4b39;'>二、运行 MySQL 容器</span>
### 1. 获取镜像
先检查是否已有该镜像：`sudo docker images`  
如果已经存在名为 `mysql` 的镜像，且 `TAG` 为 `5.7`——则进入第 2 步。  
否则从远端仓库拉取该镜像：`sudo docker pull mysql:5.7`  
拉取完毕且无错误之后，检查是否存在该镜像且 `TAG` 为 `5.7`。
### 2. 从镜像上创建并运行容器
~~先检查端口是否已被使用：sudo docker ps 查看 PORTS 一列的映射关系中，左手边（即宿主机）是否有如下端口之一：~~
```shell
3306
```
~~如果有，则不能继续，需要根据实际情况先释放这些端口才能继续。~~    
修改 mysql 启动容器脚本：`nano <准备 1 中创建的iptalk 专用文件夹>/scripts/start_iptalk_mysql.sh`  
其中如下部分需要修改，替换尖括号里面的内容为实际所需：  
```shell

############ ↓ 修改参数为所需 ↓ ############

# mysql 容器 名称 (默认为 meeyi_mysql_container)
IPTALK_MYSQL=meeyi_mysql_container

# mysql 数据文件夹 路径 (默认为 /home/iptalk/mysql)
MYSQL_DIR=/home/iptalk/mysql

# mysql 端口号 (默认为 3306)
MYSQL_PORT=3306

############ ↑ 修改参数为所需 ↑ ############

# (后略不用改 后略不用改 后略不用改 后略不用改 后略不用改 后略不用改 后略不用改)

```
保存退出后，运行：`bash <准备 1 中创建的iptalk 专用文件夹>/scripts/start_iptalk_mysql.sh`  
确认没有提示错误。  
*注：该 mysql 镜像完整使用说明 [mysql by Docker](https://store.docker.com/images/mysql)*

___

## <span style='color: #dd4b39;'>三、运行 IPTalk 容器</span>
### 1. 获取镜像
先检查是否已有该镜像：`docker images`  
如果已经存在名为 `meeyi/iptalk` 的镜像，且 `TAG` 为所需——比如 `v1.2`——则进入第 2 步。  
否则从远端仓库拉取该镜像：`docker pull meeyi/iptalk:v1.2`  
拉取完毕且无错误之后，检查是否存在该镜像且 `TAG` 为所需。  
注：所需的 `TAG` 需从 `开发者` 获知。（目前最新为 `v1.2`）
### 2. 从镜像上创建并运行容器
先检查端口是否已被使用：`docker ps` 
查看 PORTS 一列的映射关系中，左手边（即宿主机）是否有如下端口之一：
```shell
85 86 90
3456 3478 3550
12200 12345 13980
34952 34955
```
如果有，则不能继续，需要根据实际情况先释放这些端口才能继续。   
修改 iptalk 启动容器脚本：`nano <准备 1 中创建的iptalk 专用文件夹>/scripts/start_iptalk.sh`  
其中如下部分需要修改，替换尖括号里面的内容为实际所需：  
```shell

############ ↓ 修改参数为所需 ↓ ############

# mysql 容器 名称 (默认为 meeyi_mysql_container)
IPTALK_MYSQL=meeyi_mysql_container

# iptalk 专用文件夹 路径 (默认为 /home/iptalk)
IPTALK_DIR=/home/iptalk

# iptalk 容器 名称 (默认为 iptalk)
IPTALK_NAME=iptalk

# iptalk 镜像 名称 (默认为 meeyi/iptalk:v1.2)
IPTALK_IMG=meeyi/iptalk:v1.2

# mysql 端口号 (默认为 3306)
MYSQL_PORT=3306

# ftp 端口
FTP_PORT=21

# ssh 端口
SSH_PORT=10022

############ ↑ 修改参数为所需 ↑ ############

# (后略不用改 后略不用改 后略不用改 后略不用改 后略不用改 后略不用改 后略不用改)

```
保存退出后，运行：`bash <准备 1 中创建的iptalk 专用文件夹>/scripts/start_iptalk.sh`  
确认没有提示错误。  

___

## <span style='color: #dd4b39;'>四、测试</span>
访问：`http://<服务器ip>:85`

___

## <span style='color: #dd4b39;'>五、设置开机启动</span>

### 1. 运行 `nano /home/iptalk/scripts/start_iptalk_system.sh`，编辑如下部分：

```shell

############ ↓ 修改参数为所需 ↓ ############

# mysql 容器 名称 (默认为 meeyi_mysql_container)
IPTALK_MYSQL=meeyi_mysql_container

# mysql 数据文件夹 路径 (默认为 /home/iptalk/mysql)
MYSQL_DIR=/home/iptalk/mysql

# iptalk 专用文件夹 路径 (默认为 /home/iptalk)
IPTALK_DIR=/home/iptalk

############ ↑ 修改参数为所需 ↑ ############

# (后略不用改 后略不用改 后略不用改 后略不用改 后略不用改 后略不用改 后略不用改)

```

### 2. 运行 `sudo nano /etc/rc.local`，在 最后一行 `exit 0` 之前插入如下内容：

```shell
{  # your 'try' block
    sudo bash /home/iptalk/scripts/start_iptalk_system.sh
} || {  # your 'catch' block
    echo 'iptalk starting  error'
}
```

___

## <span style='color: #dd4b39;'>六、常见问题</span>
### 1. 使用 `FileZilla` 移动文件或文件夹到远程服务器目录时，传输失败
请检查目标目录的权限：`ls -l <目标目录>`  
查看我们所在的用户组的权限是否为 `rwx` 或 `rw-`  
比如通常会看到 `drwxr-xr-x` 并且我们（如 zwx 用户）所在的用户组为普通用户组，则对于 zwx 用户，我们没有权限写入任何东西  
（去掉最前面的 `d`（这个表示 directory 即目录），每3个字符为一组，分别对应用户，组，其他用户，`-`表示无此权限）  
这时就要修改这个目录的权限：`sudo chmod -R 777 <目标目录>` （`chmod` 修改权限，`-R` 表示递归到其子文件夹和子文件，`777` 是 `rwxrwxrwx` 的缩写）  
然后重新移动所需文件或文件夹到目标目录。
### 2. 运行 `start_iptalk.sh` 时出现 `ImportError: No module named win32api`
请检查 `<准备 1 中创建的iptalk 专用文件夹>/src/iptalk.py`  
注释掉如下两行：（在前面加井号表示注释掉这行）
```python
from version import Version
#from twisted.internet import iocpreactor  # ,select,poll,iocp,epoll  注释掉这行
#iocpreactor.install()  # 和这行
from core.logger import log
```
### 3. 如何停止 iptalk
修改 `<准备 1 中创建的iptalk 专用文件夹>/scripts/stop_iptalk.sh`  
```shell
#!/usr/bin/bash

pid=`pgrep -f iptalk.py` && \
if [[ $pid ]]
then
    echo "iptalk stopping ..." && \
    sudo kill -9 $pid && \
    echo "iptalk stopped."
fi && \
docker stop <二 中创建并运行的 iptalk 容器名> > /dev/null 2>&1
docker rm <二 中创建并运行的 iptalk 容器名> > /dev/null 2>&1
```
运行：`bash <准备 1 中创建的iptalk 专用文件夹>/scripts/stop_iptalk.sh`
### 4. 如何停止 mysql
修改 `<准备 1 中创建的iptalk 专用文件夹>/scripts/stop_mysql.sh`  
```shell
#!/usr/bin/bash

echo -e "\tiptalk-mysql stopping ..."
docker stop <二 中创建并运行的 mysql 容器名> > /dev/null 2>&1
docker rm <二 中创建并运行的 mysql 容器名> > /dev/null 2>&1
echo -e "\tiptalk-mysql stopped."
```
运行：`bash <准备 1 中创建的iptalk 专用文件夹>/scripts/stop_mysql.sh`