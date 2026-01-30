# Web-Print System

通过 Web 页面调用家里打印机打印文件，本机无需打印机驱动（使用 IPP 协议），同时支持手机内使用。如下图：

![image](https://p1.meituan.net/travelcube/c2ee459d863c42b77242ff22cc349c9a910526.gif)

原理：

Web-Print System -> CUPS -> Printer。

* Web-Print System 使用 IPP 协议和 CUPS 通信。
* CUPS 使用 USB 9100 端口和 打印机 通信。


当前使用 Docker 部署到 openwrt 路由器中。

> 如果IPP打印机可以通过外网访问，可以不用和打印机在同一个网络。

基于 [Nextjs](https://nextjs.org/)。

* CSS 基于[tailwindcss](https://tailwindcss.com/)。
* JSON 存储基于[node-json-db](https://github.com/Belphemur/node-json-db)。
* IPP 协议基于 [IPP](https://github.com/williamkapke/ipp) NPM包。
* IPP 文档[RFC2910](https://datatracker.ietf.org/doc/html/rfc2910)
* CUPS 不支持 word/excel 打印，使用[CloudConver](https://cloudconvert.com/)服务进行转换后在打印。
* 打印成功或失败，使用 [message-pusher](https://github.com/songquanpeng/message-pusher) 通知到自己手机。
* [AntdUI](https://ant.design/)

## docker-compose 部署方式

新建 **docker-compose.yaml** 文件，内容如下：

```shell
services:
  home-print-web:
    image: xbf321/home-print-web:latest
    container_name: home-print-web
    restart: unless-stopped
    ports:
      - 7060:7060
    environment:
      # 登录用户名和密码默认都是 test
      - AUTH_USER_NAME=test
      - AUTH_USER_PASSWORD=test
      - MESSAGE_PUSHER_SERVER_TOKEN=token
      # CloudConvert 访问 token ，用于把 word 格式转换为 pdf 格式
      - CLOUDCONVERT_ACCESS_TOKEN=token
```

安装

```shell
docker-compose up -d
```

重新安装，执行：

```shell
# 停止容器
docker-compose down
# 获取最新 image
docker-compose pull xbf321/home-print-web
# 启动
docker-compose up -d
```

## 开发

```bash
npm i
npm run dev
open http://localhost:7060/
```

Docker 其他操作

```shell
# 构建 image
docker build -t xbf321/home-print-web .

# 发布到 hub.docker.io
docker push xbf321/home-print-web:latest

# 创建容器
# 后台运行
docker run -d -p 7020:7020 -e CLOUDCONVERT_ACCESS_TOKEN=token -e AUTH_USER_NAME=aaa -e AUTH_USER_PASSWORD=aaa -e MESSAGE_PUSHER_SERVER_TOKEN=token  --name home-print-web xbf321/home-print-web:latest
# 临时运行
docker run -it --name home-print-web xbf321/home-print-web /bin/bash
# 进入容器内部
docker exec -it home-print-web /bin/bash
```
