# home-print-web

使用 IPP 协议，无需打印机驱动，通过 Web 页面调用家里打印机打印文件。如下图：

![image](https://p0.meituan.net/travelcube/14c6f8c826c93316a4a85f01b467e6f8111491.png)

目前自己使用 Docker 部署到 openwrt 路由器里。

> 如果IPP打印机可以通过外网访问，可以不用和打印机同一个网络。

## Docker 部署方式

### Docker 运行

在项目目录下，新建 **docker-compose.yaml** 文件，内容如下：

```shell
version: '3.9'

volumes:
  config-dir:
    name: config-dir
    driver: local
    driver_opts:
      o: bind
      type: none
      device: ${PWD}/config

services:
  home-print-web:
    image: xbf321/home-print-web
    container_name: home-print-web
    restart: always
    ports:
      - 7001:7001
    volumes:
      - config-dir:/root/app/config
```

安装

```shell
docker-compose up -d
```

### 配置打印机和登陆用户

修改 **config.prod.js**  注释内容：

```js
module.exports = () => {
  const userConfig = {
    // web 登陆用户
    auth: {
      userName: 'root',
      userPassword: 'root',
    },
    // 因为家里有两台打印机，所以是一个数组
    printers: [ 'http://192.168.100.1:631/printers/HP1106' ],
  };

  return {
    ...userConfig,
  };
};
```

重新执行：

```shell
# 停止容器
docker-compose down
# 启动
docker-compose up -d
```

## 开发

平台基于 [Eggjs](https://www.eggjs.org/zh-CN/intro)，因为过于简单，没有用 Vue/React MVVM 框架和复杂的UI库。

* 文件上传基于 [uppy](https://uppy.io/docs/quick-start/)
* CSS 基于[milligram](https://milligram.io/)
* JSON 存储基于[node-json-db](https://github.com/Belphemur/node-json-db)
* IPP 协议基于[ipp](https://github.com/williamkapke/ipp)

```bash
npm i
npm run dev
open http://localhost:7001/
```

构建 Docker 镜像

```shell
docker build -t xbf321/home-print-web .
```

创建容器：

```shell
# 后台运行
docker run -d -p 7001:7001 --name home-print-web xbf321/home-print-web
# 临时运行
docker run -it --name home-print-web xbf321/home-print-web
# 进入容器内部
docker exec -it home-print-web /bin/bash
```
