# sf_23d平台
## 系统介绍

​	基于卓越实验室组件微应用开发方式，使用vue框架，结合超图提供的cesium包作为第三方库，开发的实景融合2、3维展示平台。包含以下几个组件

​	1、二维底图、三维底图加载组件（cesium-viewer）

​	2、展示分区数据树，提供定位，投射，人流反演功能组件（charts，source-tree，scan-video，sjrh-menu）

​	3、人流反演以及图表组件（scan-video）

​	4、人流反演缩放功能组件（zoom-picture）

## 系统所需预下载文件

​	1、离线视频，用于基础展示功能，如需要请前往以下链接下载全部视频。请下载完成后将所有视频放入widgets/source-tree/videos 下即可

​			详情请[查看](http://file.gtmap.cn:8000/d/006f6cb2b06245148ae6/)

​	2、h5s解析视频流文件

​			详情请[查看](http://file.gtmap.cn:8000/d/4bd33d2159634df3ac55/)

```
文件名：h5s-r10.8.0330.20-win64-release.rar
```

​	3、人流反演接口文件

​			详情请[查看](http://file.gtmap.cn:8000/f/accd5919fa434854b7da/)

```
文件名：renliufanyan.exe
```

## 使用说明

### 依赖安装

​	若下载开发者模式的组件完成后，确保系统已经安装node.js软件。首先切换到淘宝镜像仓库，请参考如下代码。安装hls需要的video依赖即可

```cmd
npm config set http://registry.npm.taobao.org
npm install video.js --save
```

​	之后切换到以下仓库镜像地址进行内部依赖包的安装。控制台切换到工程目录下输入

```cmd
npm config set http://192.168.2.58:4873/
```

​	切换完成后使用

```
npm install 
```

### 	修改h5s配置

npm安装结束后，配置h5s，解压下载好的压缩包，修改config文件。进入解压好的文件找到conf文件夹，打开h5ss.conf文件。

```javascript
{
 "http": {
  "nHTTPPortComment": "HTTP server port, if port is 0, disable it",
  "nHTTPPort": 8081,
  "nHTTPSPortComment": "HTTPS server port,  if port is 0, disable it",
  "nHTTPSPort": 8443,
  "bAuthComment": "Enable authentication for HTTP/HTTPS",
  "bAuth": false
 }
```

​	最上部可以修改端口（nHTTPPort），建议修改为其他端口，8080多被占用。紧接着，翻到下方的src数组内，修改你要接入的摄像头参数，如下。

```json
"src": [
   {
    "strNameComment": "name for this stream",
    "strName": "Stream 1",
    "strTokenComment": "token for this stream, must unique, if same, only first will be available",
    "strToken": "token1",
    "nTypeComment": "source type H5_FILE/H5_STREAM/H5_ONVIF/H5_RTMP_PUSH",
    "nType": "H5_STREAM",
    "strUrlComment": "url(RTSP/RTMP...) or file path",
    "strUrl": "rtsp://192.168.60.67:554/h264/ch1/main/av_stream",
    "strUserComment": "username",
    "strUser": "admin",
    "strPasswdComment": "password",
    "strPasswd": "Gtis@123",
	..............
   }]
```

其中strName代表该流的名称，strToken代表配置文件中需要传入的token配置，可随意起名但是必须保证唯一性。如需要加载rtsp格式请修改 nType为H5_STREAM。strUrl修改为得到的rtsp地址即可。最后在strUser和strPasswd中填入需要加载的摄像头的账号密码，没有可默认。其他设置请保持默认，修改后保存，回到h5s的根目录下，找到h5ss.bat启动即可。启动完成后可进入localhost:8081中进行预览，确保实时视频已经解析接入。

### 人流反演服务开启说明

​	本项目人流反演用到的实时扫描数据是通过192.168.60.45上中存储到mysql中的数据获取，下载renliufanyan.exe后双击启动，避免其他工程占用端口，这里使用的端口为5000。服务的目的是写了一个接口，这个接口是运行在本机上的，所以请修改json配置中source-tree下的配置，其中192.168.50.126就为本机的ip不用修改。请把这个exe文件存放到tomcat的webapp下，新建一个renliufanyan文件夹放到文件夹下，双击启动即可

```json
"getRLFYNum": "http://192.168.50.126:5000/RLFYNum"
```

当前端请求这个接口的时候它就会去45上的mysql获取所有的人流反演的数据，并且保存到本机同这个exe同级的images目录下，前端再通过tomcat启动的服务获取数据即可地址同样可在json文件下修改。请修改scan-video下的配置。修改成您本机的ip地址即可

```json
"getRLFYImage": "http://192.168.50.126:8080/renliufanyan/images/"
```

回到项目中，控制台输入即可运行。

```cmd
npm run serve
```

## 开发者模式文件及配置说明

​	整套系统使用卓越地理实验室的微组件开发，需要的数据配置可根据自身需要修改。

​	1、树状目录加载所需数据，使用json文件管理，通过url请求得到，详见格式请参照widgets/source-tree/test.json文件内的格式。

​	2、需要添加各点的坐标以及相机参数，请参考widgets/source-tree/cameraConfig.js中的格式添加即可

​	3、完成test.json 文件修改配置以后请到src/main.js 目录下修改getLayerListUrl地址和h5sconfig的内容即可，详情请见下图。

​		请找到对应的widgets名字为source-tree在其下方进行修改。例如

```javascript
config:{
  _widget:{......},
  getLayerListUrl: "http://192.168.60.45/treeData/test.json",//获取资源树需要的配置文件，请参考source-tree下的test.json格式
  getRLFYUrl: "",//人流反演所需接口地址
  h5sconfig: {
    videoid: '010307010508', //拿到video的id
    protocol: 'http:',
    host: 'yourip:8081',//h5s设置的端口号以及你的h5s在哪个服务器上启动
    rootpath: '/',
    token: 'token1',//对应在h5s输入账号密码选项的token
    hlsver: 'v1',//保持默认
    session: 'c1782caf-b670-42d8-ba90-2244d0b0ee83'//保持默认
   }
}
```

4、修改底图加载的地址，在main.js内找到cesium-viewer组件修改配置即可

```javascript
config:{
  _widget:{......},
 urlConfig: {
   MAP_YX: 'http://192.168.60.45:8099/iserver/services/map-Lianchuang/rest/maps/LianchuangYX_1%40Lianchuang',
   MAP_NJYX: 'http://192.168.60.45:8099/iserver/services/map-njyx/rest/maps/gulou_jianye%40njyx',
   MODEL_LIANCHUANG: 'http://192.168.60.45:8099/iserver/services/3D-Lianchuang/rest/realspace/datas/yuanqu/config',
   MODEL_13FLOOR: 'http://192.168.60.45:8099/iserver/services/3D-Lianchuang829/rest/realspace/datas/Louceng@Lianchuang/config',
   MODEL_JN: 'http://192.168.60.45:8099/iserver/services/3D-jnghcjhc/rest/realspace/datas/config/config'
          }
}
```

5、人流反演服务地址修改，目前内部统一的展示数据都在192.168.60.45这台计算机上，通过发布接口服务的方式提供访问

```json
getRLFYUrl: "http://192.168.60.45:5000/allCameraRenliuliangPara"
```

6、hls加载配置

```json
hlsSrc:'http://play2.allcam.com.cn/live/push_32000000000105010103000000004281.m3u8',
isVideo:true
```

目前的展示系统中只设置了一个用于解析hls的video标签，需要解析更多的hls请联系程序人员

## 打包部署项目

所需文件：

​	1、打包以后的lib包

​	2、配置好的json文件

发布过程：

​	请把打包好的lib包放入tomcat下的webapp新建文件夹下，文件夹名字保持与打包好的内部文件名一致，配置好的json文件放入webapp文件夹下的data中，启动tomcat通过网址访问。详情请见如下说明

### 说明

下载开发者模式的项目后，使用命令打包整个项目

```node
npm run bulid:lib
```

打包结束后会在项目一级目录下生成一个lib文件夹，请复制整个文件夹到tomcat的webapp下。请注意文件夹名字，与内部文件名保持一致。现成的lib包请[查看](http://file.gtmap.cn:8000/f/899f7958cbda4f79bea8/)下载

```
文件名：shijingronghe-widgets.7z
```

该项目的组件使用与运行都是通过json进行，也就是说我需要什么组件就在json中设置什么组件即可，以及内部网页所需要的配置都可在json中修改。指定正确的资源地址，即可使用，可参考项目用sjrh.json格式修改即可。json中用的通用依赖包请通过以下地址获取，与shijingronghe-widgets同级即可

```
文件名：assets.7z 系统加载所需要的静态图片资源 http://file.gtmap.cn:8000/f/2ae9405a06e04654aeab/
scene-widgets 基础组件库 http://file.gtmap.cn:8000/f/e8187069b5704cdcacf4/
base-widgets  基础组件库 http://file.gtmap.cn:8000/f/d6a77f1579c741858402/
```

json文件配置好后，放进tomcat下的webapp中data文件夹，启动tomcat即可通过网址访问。

```
网址：http://你的ip地址:8080/#/viewer?pageId=sjrh.json
```

