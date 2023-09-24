# home-print-web

使用 IPP 协议，无需打印机驱动，通过 Web 页面调用家里打印机打印文件。如下图：

![image](https://p0.meituan.net/travelcube/14c6f8c826c93316a4a85f01b467e6f8111491.png)

目前自己使用 Docker 部署到 openwrt 路由器里。

> 如果IPP打印机可以通过外网访问，可以不用和打印机同一个网络。

## Docker 部署方式

### Docker 运行

1. 在目录下，新建 **docker-compose.yaml** 文件，内容如下：

```shell
version: '3.9'
services:
  home-print-web:
    image: xbf321/home-print-web
    container_name: home-print-web
    restart: unless-stopped
    ports:
      - 7020:7020
    environment:
      - PRINTER=http://192.168.100.1:631/printers/HP1106
      - AUTH_USER_NAME=test
      - AUTH_USER_PASSWORD=test
      - MESSAGE_PUSHER_SERVER=http://192.168.100.1:7030/push/root
      - CLOUDCONVERT_ACCESS_TOKEN=token
```

说明：
**AUTH_USER_NAME**: 登录用户名
**AUTH_USER_PASSWORD**：登录密码
**MESSAGE_PUSHER_SERVER**：错误日志发送到PushServer中
**CLOUDCONVERT_ACCESS_TOKEN**：CloudConvert 访问 token ，用于把 word 格式转换为 pdf 格式

2. 安装

```shell
docker-compose up -d
```

重新安装，执行：

```shell
# 停止容器
docker-compose down
# 启动
docker-compose up -d
```

## 开发

平台基于 [Nuxt](https://nuxt.com/)。

* CSS 基于[tailwindcss](https://tailwindcss.com/)
* JSON 存储基于[node-json-db](https://github.com/Belphemur/node-json-db)
* IPP 协议基于[ipp](https://github.com/williamkapke/ipp)
* 因为 CUPS 不支持 word/excel 打印，针对这些文件使用[CloudConver](https://cloudconvert.com/)转换

```bash
npm i
npm run dev
open http://localhost:7020/
```

构建 Docker 镜像

```shell
docker build --no-cache -t xbf321/home-print-web .
```

创建容器：

```shell
# 后台运行
docker run -d -p 7020:7020 --name home-print-web xbf321/home-print-web
# 临时运行
docker run -it --name home-print-web xbf321/home-print-web /bin/bash
# 进入容器内部
docker exec -it home-print-web /bin/bash
```
