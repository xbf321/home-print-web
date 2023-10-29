# Web-Print System

通过 Web 页面调用家里打印机打印文件，本机无需打印机驱动（使用 IPP 协议），同时支持手机内使用。如下图：

![image](https://p1.meituan.net/travelcube/c2ee459d863c42b77242ff22cc349c9a910526.gif)

原理：

Web-Print System -> CUPS -> Printer。

* Web-Print System 使用 IPP 协议和 CUPS 通信。
* CUPS 使用 USB 9100 端口和 打印机 通信。


当前使用 Docker 部署到 openwrt 路由器中。

> 如果IPP打印机可以通过外网访问，可以不用和打印机在同一个网络。

基于 [Nuxt](https://nuxt.com/)。

* CSS 基于[tailwindcss](https://tailwindcss.com/)。
* JSON 存储基于[node-json-db](https://github.com/Belphemur/node-json-db)。
* IPP 协议基于 [IPP](https://github.com/williamkapke/ipp) NPM包。
* CUPS 不支持 word/excel 打印，使用[CloudConver](https://cloudconvert.com/)服务进行转换后在打印。
* 打印成功或失败，使用 [message-pusher](https://github.com/songquanpeng/message-pusher) 通知到自己手机。
* 默认 Nitro 不包含日志输出到文件，因此使用 [winston](https://github.com/winstonjs/winston) 包处理日志。目的是程序出现任何异常，需要通知到用户（自己手机）。
* 上传文件保存至物理文件夹，基于[formidable](https://www.npmjs.com/package/formidable)。
* Toast 提示使用[vue-toast-notification](https://www.npmjs.com/package/vue-toast-notification)。

## docker-compose 部署方式

新建 **docker-compose.yaml** 文件，内容如下：

```shell
version: '3.9'
services:
  home-print-web:
    image: xbf321/home-print-web:latest
    container_name: home-print-web
    restart: unless-stopped
    ports:
      - 7020:7020
    environment:
      # 默认：http://192.168.100.1:631/printers/HP1106
      # - PRINTER=http://192.168.100.1:631/printers/HP1106
      # 登录用户名和密码默认都是 test
      - AUTH_USER_NAME=test
      - AUTH_USER_PASSWORD=test
      # 默认：http://192.168.100.1:7030/push/root
      # 日志发送到PushServer中
      # - MESSAGE_PUSHER_SERVER=http://192.168.100.1:7030/push/root
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
open http://localhost:7020/
```

Docker 其他操作

```shell
# 构建 image
docker build --no-cache -t xbf321/home-print-web .

# 发布到 hub.docker.io
docker push xbf321/home-print-web:latest

# 创建容器
# 后台运行
docker run -d -p 7020:7020 -e CLOUDCONVERT_ACCESS_TOKEN=token -e AUTH_USER_NAME=aaa -e AUTH_USER_PASSWORD=aaa  --name home-print-web xbf321/home-print-web:latest
# 临时运行
docker run -it --name home-print-web xbf321/home-print-web /bin/bash
# 进入容器内部
docker exec -it home-print-web /bin/bash
```
