<template>
  <div id="resourceTree" class="back" v-show="isShowSourceTree">
    <a-input-search
      style="margin-bottom: 8px"
      placeholder="Search"
      @change="onChange"/>
    <a-tree
      onselectstart="return false"
      :tree-data="layerList"
      :expandedKeys="expandedKeys"
      @expand="onExpand"
      :autoExpandParent="autoExpandParent"
      :selectable="true"
      checkable
      @check="onCheck"
      v-model="checkedKeys">
      <template slot="custom1" slot-scope="item">
            <span v-if="item.title.indexOf(searchValue) > -1">
              {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
              <span style="color: blue">{{ searchValue }}</span>
              {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
            </span>
        <span v-else>{{ item.title }}</span>
        <img src="../../assets/img/定位.png"
             style="position:relative;left:70px; width:20px;height:20px"
             @click="locate(item.id)"
        />
        <img src="../../assets/img/摄像头.png"
             style="position:relative;left:80px; width:20px;height:20px"
             @click="parentProjectionClick(item, $event)"/>
      </template>

      <template slot="custom2" slot-scope="item">
            <span v-if="item.title.indexOf(searchValue) > -1">
              {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
              <span style="color: blue">{{ searchValue }}</span>
              {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
            </span>
        <span v-else>{{ item.title }}</span>
        <img class="locate" src="../../assets/img/定位.png"
             style="position:relative;left:70px; width:20px;height:20px"
             @click="locate(item.id)"/>
        <img class="video" src="../../assets/img/摄像头.png"
             style="position:relative;left:80px; width:20px;height:20px"
             @click="childProjectionClick(item, $event)"/>
        <img :src="peopleSrc" class="people"
             style="position:relative;left:90px; width:20px;height:20px"
             @click="startPeopleFlow(item, $event)"/>
      </template>

      <template slot="custom3" slot-scope="item">
            <span v-if="item.title.indexOf(searchValue) > -1">
              {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
              <span style="color: blue">{{ searchValue }}</span>
              {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
            </span>
        <span v-else>{{ item.title }}</span>
        <a-button :disabled="button" class="getSum" @click="statisfy">统计</a-button>
      </template>
    </a-tree>
    <div ref="video" v-show="false"></div>
    <!--        <video id="video1" class="video-js vjs-default-skin" muted-->
    <!--               controls-->
    <!--               width="640"-->
    <!--               height="320"-->
    <!--               style="position: relative"-->
    <!--               v-show="this.isVideo">-->
    <!--          <source :src="this.hlsSrc" type="application/x-mpegURL"/>-->
    <!--        </video>-->
  </div>
</template>
<script>
import axios from "axios";
import peopleFlow from "./peopleFlow";
import Projection from "./projectionImage/Projection";
import Videojs from "video.js";
import "video.js/dist/video-js.min.css";
import flvjs from 'flv.js'
import Qs from 'qs'

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({key, title: node.title});
    if (node.children) {
      generateList(node.children);
    }
  }
};
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.title === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default {
  name: "main",
  data() {
    return {
      isShowSourceTree: false,
      layerList: [],
      expandedKeys: [],
      autoExpandParent: true,
      searchValue: "",
      //  人流反演
      isShowPeopleFlow: false,
      camerasLatestInfo: [],
      history: {},
      current: {},
      camerasTopFive: {},
      isHeatMap: false,
      isPeopleFlow: false,
      peopleSrc: require("../../assets/img/人口.png"),
      activePeopleSrc: require("../../assets/img/人口_press.png"),
      projectionSrc: require("../../assets/img/摄像头.png"),
      activeProjectionSrc: require("../../assets/img/摄像头点击.png"),
      parentClick: false, //记录父节点点击情况
      lastChildClick: {},
      //记录投射按钮点击状态
      currentClick: false,
      lastClick: false,
      lastItem: {},
      lastParentItem: {},
      myPlayer: {},
      button: true,
      cameraArray: [],
      checkedKeys: [],
      lastPeopleFlow: null,
      cameraConfig: [],
      currentCameraConfig: "",
      lastParentCheckClick: null,
      expandAllNode: false
    };
  },
  mounted() {
    let _this = this;
    axios
      .get(_this.getLayerListUrl)
      .then(response => {
        this.layerList = response.data.layerList;
        generateList(this.layerList);
        // console.log(this.layerList);
      })
      .catch(function (err) {
        _this.$message.error("获取目录树数据失败");
      });
    //获取摄像头参数
    axios
      .get(_this.getCameraConfig)
      .then(response => {
        this.cameraConfig = response.data.cameraConfig;
      })
      .catch(function (err) {
        _this.$message.error("摄像头参数失败");
      });
    this.on("closePeopleFlow", val => {
      if (window.timer) {
        clearInterval(window.timer);
        _this.isShowPeopleFlow = false;
        _this.isPeopleFlow = false;
        var imgs = document.getElementsByClassName("people");
        imgs.forEach(function (item) {
          item.src = _this.peopleSrc;
        });
        this.$message.success("关闭人流反演", 1);
      }
    });
    this.on("isShowSourceTree", isShowSourceTree => {
      this.isShowSourceTree = isShowSourceTree;
      this.expandAllNode = true
    });
    this.on("closeStatic", () => {
      //重置复选框的选中以及提交函数
      this.checkedKeys = [];
      this.cameraArray = [];
      this.button = true;
    });

  },
  methods: {
    locate(id) {
      this.$message.success("开始飞行", 1);
      if (id === '010502' || id === "010501" || id === "010503") {
        Projection.location(id, this.FLY_CONFIG)
      } else {
        Projection.location(id, this.CAMERA_CONFIG);
      }
    },
    startPeopleFlow(val, e) {
      this.emit("isShowPeopleFlow", false);
      clearInterval(window.timer);
      this.isHeatMap = false;
      let _this = this;
      peopleFlow.removeHeatMap();
      peopleFlow.removeHeatMap();
      //重置复选框的选中以及提交函数
      this.checkedKeys = [];
      this.cameraArray = [];
      this.button = true;
      this.emit("isHeatMap", this.isHeatMap);
      if (val.cameraID || val.id === "010307010508") {
        //说明带有cameraID 那么也需要进行人流反演
        if (this.isPeopleFlow && this.lastPeopleFlow && val.id !== this.lastPeopleFlow.id) {
          //说明保持上一个人流反演的状态点击了下一个人流反演
          //先变蓝
          let imgs = document.getElementsByClassName("people");
          imgs.forEach(item => {
            item.src = _this.peopleSrc;
          });
          //开始当前的人流反演
          this.$message.success("开始人流反演", 1);
          e.target.src = this.activePeopleSrc;
          this.getCurrentCameraConfig(val.cameraID);
          this.getCurrentCameraTopFive(_this.currentCameraConfig["url"], val.cameraID, _this.currentCameraConfig["ptz"], _this.currentCameraConfig["videoUrl"]);
          _this.emit("charts", val.title);
          _this.emit("isLoading", true);
        } else {
          this.isPeopleFlow = !this.isPeopleFlow;
          this.isShowPeopleFlow = !this.isShowPeopleFlow;
          if (this.isPeopleFlow) {
            this.$message.success("开始人流反演", 1);
            e.target.src = this.activePeopleSrc;
            this.emit("isShowPeopleFlow", false); //若统计面板显示这里应该先关闭
            this.getCurrentCameraConfig(val.cameraID);
            this.getCurrentCameraTopFive(_this.currentCameraConfig["url"], val.cameraID, _this.currentCameraConfig["ptz"], _this.currentCameraConfig["videoUrl"]);
            _this.emit("charts", val.title);
            _this.emit("isLoading", true);
          } else {
            this.$message.success("关闭人流反演", 1);
            peopleFlow.removeHeatMap();
            peopleFlow.removeManModel();
            e.target.src = this.peopleSrc;

            this.emit("isShowPeopleFlow", false);
            _this.emit("isLoading", false);
          }
        }
      } else {
        this.$message.error("没有人流反演与之对应的数据无法进行", 1);
      }
      this.lastPeopleFlow = val;
    },
    onSelect(keys, event) {
      // console.log('Trigger Select', keys, event)
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.title, this.layerList);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    },
    onCheck(checkedKeys, {checked, checkedNodes, node}) {
      this.checkedKeys = checkedKeys;
      // console.log(this.checkedKeys);
      // console.log('checkedNodes', checkedNodes);
      // console.log('node', node);
      if (checked && node.dataRef.des.includes("father")) {
        //点击父节点
        this.button = false;
        if (
          this.lastParentCheckClick &&
          this.lastParentCheckClick.dataRef.des !== node.dataRef.des
        ) {
          //已经点击了父节点了，剩下的父节点不能点击
          this.$message.error("请统计同一区域内的摄像头", 1);
          let index = this.getArrayIndex(this.checkedKeys, node.dataRef.key);
          this.checkedKeys.splice(index, node.dataRef.children.length + 1);
          // console.log(this.checkedKeys);
        }
        node.dataRef.children.forEach(item => {
          if (item.cameraID) {
            this.cameraConfig.forEach(info => {
              if (item.cameraID && item.cameraID === info.cameraID) {
                //对cameraConfig的内容做一个解构，只拿我需要的数据
                let tempObj = {};
                tempObj.cameraID = info.cameraID;
                tempObj.parTitle = info.parTitle;
                tempObj.title = info.title;
                if (this.cameraArray.length > 0) {
                  //判断是否是第二次点击父节点
                  let checkString = this.cameraArray[
                  this.cameraArray.length - 1
                    ].cameraID.slice(-2);
                  if (info.cameraID.slice(-2) === checkString) {
                    console.log(this.cameraArray[this.cameraArray.length - 1]);
                    this.cameraArray.push(tempObj);
                  }
                } else {
                  this.cameraArray.push(tempObj);
                }
              }
            });
          }
        });
        //如果子节点有一个没有cameraID应该就不能选中父节点
        for (let i = 0; i < node.dataRef.children.length; i++) {
          if (!node.dataRef.children[i].cameraID) {
            let index = this.getArrayIndex(checkedKeys, node.dataRef.key);
            if (index !== -1) {
              this.checkedKeys.splice(this.getArrayIndex(checkedKeys, node.dataRef.key));
              this.$message.error("该父节点下有摄像头没有cameraID无法选中，请检查", 1);
            }
          }
          break;
        }
        this.lastParentCheckClick = node;
      } else if (checked && node.dataRef.cameraID) {
        //选中单个子节点
        let mark = false;
        let getInfomation = false;
        this.button = false;
        if (this.checkedKeys.length > 1 && !this.checkedKeys[0].includes(this.checkedKeys[checkedKeys.length - 1].slice(0, -2))) {
          //说明已经点击第二次且点击的子节点不是同类型 不能点击
          this.$message.error("请统计同一区域内的摄像头", 1);
          this.checkedKeys.pop();
          mark = true; //这里虽然做了弹出复选框的操作，但是下面的cameraArray仍然回去push，通过这个状态去控制它告诉下面这个判断,不push不是同类型的camera信息
        }
        //选中单个子节点，包含有cameraID并且也请求到了，和有cameraID没有请求到
        for (let info = 0; info < this.cameraConfig.length; info++) {
          if (node.dataRef.cameraID === this.cameraConfig[info].cameraID && mark === false) {
            let tempObj = {};
            tempObj.parTitle = this.cameraConfig[info].parTitle;
            tempObj.title = this.cameraConfig[info].title;
            tempObj.cameraID = this.cameraConfig[info].cameraID;
            this.cameraArray.push(tempObj);
            getInfomation = true;
            break;
          }
        }
        if (!getInfomation) {
          //getInfomation返回了false说明有cameraID但是没有接收到数据
          if (this.checkedKeys.indexOf(node.dataRef.key) !== -1) {
            //解决已选中但是被POP的bug,indexOf 如果不包含这个字符串就会返回-1
            this.checkedKeys.pop();
            this.$message.error("没有请求到对应的camera数据，请检查", 1);
          }
        }
      } else if (checked && !node.dataRef.cameraID && !node.dataRef.des.includes("father")) {
        //无ID无法选中
        this.$message.error("该摄像头没有cameraID，请检查或配置", 1);
        this.checkedKeys.pop();
      } else if (checked === false && node.dataRef.cameraID) {
        //取消带有cameraID单个节点的选中
        this.cameraArray.forEach(s => {
          if (s.cameraID === node.dataRef.cameraID) {
            let index = this.getArrayIndex(this.cameraArray, s);
            this.cameraArray.splice(index, 1);
          }
        });
      } else if (checked === false && node.dataRef.des.includes("father")) {
        //点击父节点复选框，全部取消
        this.lastParentCheckClick = null;
        this.cameraArray = [];
      }
      this.cameraArray = Array.from(new Set(this.cameraArray)); //去重操作
      if (!this.checkedKeys[0]) {
        this.button = true; //没有选中任何一个节点
      }
    },
    statisfy() {
      peopleFlow.removeHeatMap();
      peopleFlow.removeManModel()
      var imgs = document.getElementsByClassName("people");
      imgs.forEach((item) => {
        item.src = this.peopleSrc;
      });
      this.emit("isShowPeopleFlow", false);
      let arr = [];
      let cameras = {};
      cameras.cameraIds = [];
      for (let single of this.cameraArray) {
        cameras.cameraIds.push(single.cameraID);
      }
      //console.log(this.cameraArray)
      //console.log('.....', this.cameraConfig)
      axios
        .post(this.rlfyUrl+"getHistoryTJ", cameras)
        .then(response => {
          if (response.status === 200) {
            let camerasInfo = response.data;
            let i = 0;
            for (let cameraId in camerasInfo) {
              let tempObj = {};
              tempObj.cameraID = cameraId;
              tempObj.parTitle = this.cameraArray[i].parTitle;
              tempObj.title = this.cameraArray[i].title;
              tempObj.info = camerasInfo[cameraId];
              arr.push(tempObj);
              i++;
            }
            console.log("提交的arr", arr);
            let heatMapDataTJ = []
            let heatMapMaxValueTJ = 0
            let heatMapBoundTJ = {
              "west": this.cameraConfig[0].ptz.longitude,
              "east": this.cameraConfig[0].ptz.longitude,
              "south": this.cameraConfig[0].ptz.latitude,
              "north": this.cameraConfig[0].ptz.latitude
            }
            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < this.cameraConfig.length; j++) {
                if (arr[i].cameraID == this.cameraConfig[j].cameraID) {
                  let data = {}
                  let longitude = 0
                  let latitude = 0
                  for (let item = 0; item < arr[i].info[arr[i].info.length - 1].persons.length; item++) {
                    longitude = longitude + arr[i].info[arr[i].info.length - 1].persons[item].longitude
                    latitude = latitude + arr[i].info[arr[i].info.length - 1].persons[item].latitude
                  }
                  data.x = longitude / arr[i].info[arr[i].info.length - 1].persons.length;
                  data.y = latitude / arr[i].info[arr[i].info.length - 1].persons.length;
                  data.value = arr[i].info[arr[i].info.length - 1].persons.length;
                  if (heatMapMaxValueTJ < data.value) {
                    heatMapMaxValueTJ = data.value
                  }
                  if (heatMapBoundTJ.west > data.x) {
                    heatMapBoundTJ.west = data.x
                  }
                  if (heatMapBoundTJ.east < this.cameraConfig[j].ptz.longitude) {
                    heatMapBoundTJ.east = this.cameraConfig[j].ptz.longitude
                  }
                  if (heatMapBoundTJ.south > this.cameraConfig[j].ptz.latitude) {
                    heatMapBoundTJ.south = this.cameraConfig[j].ptz.latitude
                  }
                  if (heatMapBoundTJ.north < this.cameraConfig[j].ptz.latitude) {
                    heatMapBoundTJ.north = this.cameraConfig[j].ptz.latitude
                  }
                  heatMapDataTJ.push(data)
                }
              }
            }
            peopleFlow.createHeatMap("TJ", 0, heatMapMaxValueTJ, heatMapDataTJ, heatMapBoundTJ)
            this.emit("statisfy", arr);
          }
        })
        .catch(() => {
          arr = [];
          this.$message.error("获取统计数据失败");
        });
    },
    childProjectionClick(camera, e) {
      let _this = this;
      for (let item in _this.CAMERA_CONFIG) {
        if (_this.CAMERA_CONFIG[item].id === camera.id) {
          let site = _this.CAMERA_CONFIG[item];
          if (
            this.lastClick &&
            _this.CAMERA_CONFIG[item].id !== this.lastItem.id
          ) {
            //说明在保持上一个currentClick为true的状态进入了另外一个节点的点击
            //1取消上一个图标变为蓝色
            this.lastChildClick.src = this.projectionSrc;
            //2.删除上一个实体
            globalData.monitorLayer.remove(
              globalData.monitorLayer.getById(this.lastItem.id)
            );
            globalData.monitorLayer.remove(
              globalData.monitorLayer.getById(this.lastItem.lineID)
            );
            //3.修改currentClick为false
            this.currentClick = false;
          }
          if (this.parentClick) {
            //进入判断说明在保持父节点点击的状态进入了子节点的点击
            //1.取消父节点的红色状态
            this.lastChildClick.src = this.projectionSrc;
            //2.删除父节点填加的实体
            Projection.deleteEntities();
            //3.修改父节点的点击状态
            this.parentClick = false;
            //4.填加当前点击节点的实体
            Projection.addEntities(camera.id, site.lineID, site);
            //5.判断是否是12楼或13楼办公区
            if (camera.id === "010307010506" || camera.id === "010307010508") {
              Projection.checkLCModule(globalData.S3MLayer).visible = false;
            } else {
              Projection.showLCModel(globalData.S3MLayer);
            }
          }
          this.lastClick = false; //初始化，把上一次点击的状态变为false
          this.currentClick = !this.currentClick; //改变点击状态
          Projection.removeAllProjection(globalData.projectionArray);
          globalData.lastProjectionImage = false;
          globalData.currentProjectionImage = false; //取消所有投射
          //根据id 拿video，video的id也设置成了相应的id
          let videoElement = this.addVideo(this.getCameraObj(camera.id).cameraSrc, camera.id);
          site.lon = _this.CAMERA_CONFIG[item].position.lon;
          site.lat = _this.CAMERA_CONFIG[item].position.lat;
          site.alt = _this.CAMERA_CONFIG[item].position.height;
          site.direction = _this.CAMERA_CONFIG[item].hpr.heading;
          site.pitch = _this.CAMERA_CONFIG[item].hpr.pitch;
          site.horizontalFOV = _this.CAMERA_CONFIG[item].hpr.horizontalFOV;
          site.verticalFOV = _this.CAMERA_CONFIG[item].hpr.verticalFOV;
          site.lineID = _this.CAMERA_CONFIG[item].lineID;
          //记录点击状态切换
          if (this.currentClick) {
            this.lastChildClick.src = this.projectionSrc;
            e.target.src = this.activeProjectionSrc;
            this.lastChildClick = e.target; //拿到当前点击的img标签，下次点击其他子节点的img标签时，修改它的src变成蓝色摄像头
            Projection.deleteEntities();
            Projection.addEntities(camera.id, site.lineID, site);
            this.emit("isLoading", true);//填加蒙板，解析flv需要2-3秒时间
          } else {
            globalData.monitorLayer.remove(
              globalData.monitorLayer.getById(camera.id)
            );
            globalData.monitorLayer.remove(
              globalData.monitorLayer.getById(site.lineID)
            );
            e.target.src = this.projectionSrc;
          }
          //判断是否点击的是13楼或12楼的办公区 隐藏LC图层
          if (camera.id === "010307010506" || camera.id === "010307010508") {
            Projection.checkLCModule(globalData.S3MLayer).visible = false;
          } else {
            Projection.showLCModel(globalData.S3MLayer);
          }
          //判断是否是第八个子元素被点击执行h5s
          if (camera.id === this.h5sconfig.videoid && this.h5sconfig.videoid) {
            Projection.setH5sVideoSource(this.h5sconfig);
          }

          //判断是否是hls加载方式
          if (camera.type === 'flv') {
            //解析flv
            this.flvVideo(camera, videoElement)
          }
          // if (camera.type==='hls' && this.setHls){
          //   this.initVideo(videoElement); //解析hls
          // }
          setTimeout(() => {
            this.emit("isLoading", false);//关闭蒙板
          }, 9000)
          globalData.handler.setInputAction(function (click) {
            let pick = viewer.scene.pick(click.position);
            if (Cesium.defined(pick) && pick.id._id === camera.id) {
              globalData.currentProjectionImage = !globalData.currentProjectionImage;
              if (globalData.currentProjectionImage !== true) {
                Projection.removeProjection(globalData.projectionArray, camera.id);
                let flyPoint = _this.getCameraObj(camera.id.slice(0, -2));
                // Projection.setViewpoint(flyPoint.position.lon, flyPoint.position.lat, flyPoint.position.height, flyPoint.hpr.heading, flyPoint.hpr.pitch);
              } else {
                _this.emit("showMessage", true);
                Projection.projectionImage(camera.id, site.lon, site.lat, site.alt, site.direction, site.pitch, site.verticalFOV, site.horizontalFOV, 1000, videoElement);
              }
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          this.lastClick = this.currentClick;
          globalData.lastProjectionImage = globalData.currentProjectionImage;
          this.lastItem = _this.CAMERA_CONFIG[item];
        }
      }
    },
    parentProjectionClick(item, e) {
      let _this = this;
      if (item.des.includes("father") && item.children[0] && item.children[0].des === "child") {
        if (this.lastChildClick && this.lastParentItem.id !== item.id) {
          //说明在保持上一个父节点点击的状态切换到了下一个父节点的点击
          this.lastChildClick.src = this.projectionSrc; //上次点击的摄像头变为蓝色
          e.target.src = this.activeProjectionSrc; //改变这次点击的摄像头为红色
          //删除上一个实体
          globalData.monitorLayer.removeAll();
          //修改parentClick为false
          this.parentClick = false;
        }
        this.parentClick = !this.parentClick;
        this.currentClick = false; //子节点的状态记录跟父节点不是一个，这里重置子节点的状态
        Projection.showLCModel(globalData.S3MLayer);
        if (this.parentClick) {
          this.lastChildClick.src = this.projectionSrc; //上次点击的摄像头变为蓝色
          e.target.src = this.activeProjectionSrc; //改变这次点击的摄像头为红色
          this.lastChildClick = e.target; //拿到这次点击的对象，方便下次点击修改摄像头颜色
          let site = {};
          let list = [];
          for (let e in _this.CAMERA_CONFIG) {
            item.children.forEach(camera => {
              if (_this.CAMERA_CONFIG[e].lineID && camera.id === _this.CAMERA_CONFIG[e].id) {
                site = _this.CAMERA_CONFIG[e];
                site.lon = _this.CAMERA_CONFIG[e].position.lon;
                site.lat = _this.CAMERA_CONFIG[e].position.lat;
                site.alt = _this.CAMERA_CONFIG[e].position.height;
                site.direction = _this.CAMERA_CONFIG[e].hpr.heading;
                site.pitch = _this.CAMERA_CONFIG[e].hpr.pitch;
                site.id = _this.CAMERA_CONFIG[e].id;
                site.lineID = _this.CAMERA_CONFIG[e].lineID;
                list.push(site);
              }
            });
          }
          let flyPosition = this.getCameraObj(item.id);
          Projection.setViewpoint(flyPosition.position.lon, flyPosition.position.lat, flyPosition.position.height, flyPosition.hpr.heading, flyPosition.hpr.pitch);
          globalData.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //因为handler是一个全局变量，避免在子节点上点击投射绑定后，在父节点点击加载实体后，点击上次的子节点还有投射的bug
          //确保没有实体加载
          Projection.deleteEntities();
          //显示父节点下的所有实体
          list.map(data => {
            Projection.addEntities(data.id, data.lineID, data);
          });
        } else {
          e.target.src = this.projectionSrc;
          this.lastChildClick.src = this.projectionSrc;
          globalData.monitorLayer.removeAll();
        }
        this.lastParentItem = item;
      }
    },
    initVideo(videoElement) {
      this.$nextTick(() => {
        this.myPlayer = Videojs(videoElement, {
          autoplay: "muted",
          preload: "auto",
          controls: true
        });
      });
    },
    getCameraObj(id) {
      let camearaObj = null;
      for (let item in this.CAMERA_CONFIG) {
        if (id === this.CAMERA_CONFIG[item].id) {
          camearaObj = this.CAMERA_CONFIG[item];
        }
      }
      if (camearaObj == null) {
        this.$message.error("camera配置中没有与之对应的ID，请配置或检查ID");
      }
      return camearaObj;
    },
    addVideo(videoSrc, id) {
      let video;
      video = document.createElement("video");
      video.setAttribute("id", id);
      video.setAttribute("muted", "muted");
      video.setAttribute("autoplay", "autoplay");
      video.setAttribute("loop", "loop");
      video.setAttribute("class", "h5svideo");
      video.setAttribute("control", "control");
      if (videoSrc) {
        video.setAttribute("src", videoSrc);
      }
      video.setAttribute("crossOrigin", "anonymous");
      this.$refs.video.appendChild(video);
      return video;
    },
    getArrayIndex(arr, obj) {
      let i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return i;
        }
      }
      return -1;
    },
    getCurrentCameraTopFive(url, cameraID, ptz, videoUrl) {
      let _this = this;
      let historyUrl = _this.rlfyUrl+"getHistoryRLFY/" + cameraID;
      axios
        .get(historyUrl)
        .then(response => {
          let res = response.data;
          let info = [];
          for (let i = 0; i < res.length; i++) {
            let one = {};
            one.peopleNum = res[i].persons.length;
            one.peoples = res[i].persons;
            one.image = res[i].image;
            one.time = res[i].time;
            info.push(one);
          }
          let currentUrl = _this.rlfyUrl+"getCurrent";
          let data = {
            url: url,
            videoUrl: videoUrl,
            cameraId: cameraID,
            ptz: ptz
          };
          axios
            .post(currentUrl, data)
            .then(response => {
              if (response.status == 200) {
                let last = {};
                let now = new Date();
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                let date = now.getDate();
                let hour = now.getHours(); //得到小时
                let minu = now.getMinutes(); //得到分钟
                let sec = now.getSeconds(); //得到秒
                let monthStr = "";
                let dateStr = "";
                let hourStr = "";
                let minuStr = "";
                let secStr = "";
                if (month < 10) {
                  monthStr = "0" + month.toString();
                } else {
                  monthStr = month.toString();
                }
                if (date < 10) {
                  dateStr = "0" + date.toString();
                } else {
                  dateStr = date.toString();
                }
                if (hour < 10) {
                  hourStr = "0" + hour.toString();
                } else {
                  hourStr = hour.toString();
                }
                if (minu < 10) {
                  minuStr = "0" + minu.toString();
                } else {
                  minuStr = minu.toString();
                }
                if (sec < 10) {
                  secStr = "0" + sec.toString();
                } else {
                  secStr = sec.toString();
                }
                let time = year.toString() + monthStr + dateStr + hourStr + minuStr + secStr;
                last.peopleNum=0;
                last.peoples=[]
                for(let i=0;i<response.data.res.length;i++){
                  if(response.data.res[i].type=="person"){
                    last.peopleNum=last.peopleNum+1
                    last.peoples.push(response.data.res[i])
                  }
                }
                last.imageUpload = response.data.imgStr1;
                last.imageOutput = response.data.imgStr;
                last.time = time;
                info.push(last);
                _this.camerasTopFive.cameraID = cameraID;
                _this.camerasTopFive.info = info;
                peopleFlow.addPeoplesByLatest(instanceLayer, _this.camerasTopFive.info[_this.camerasTopFive.info.length - 1].peoples);
                _this.emit("currentCameraTopFive", _this.camerasTopFive);
                _this.emit("isShowPeopleFlow", true);
                _this.emit("isLoading", false);
              }
            })
            .catch(function (err) {
              _this.emit("isLoading", false);
              _this.$message.error("获取数据失败");
            });
        })
        .catch(function (err) {
          _this.emit("isLoading", false);
          console.log("第一个axios出错");
          _this.$message.error("获取数据失败");
        });
    },
    getCurrentCameraConfig(cameraID) {
      for (let i = 0; i < this.cameraConfig.length; i++) {
        if (cameraID === this.cameraConfig[i].cameraID) {
          this.currentCameraConfig = this.cameraConfig[i];
        }
      }
    },
    flvVideo(camera, videoElement) {
        //flv流视频解析
        let data = {
          deviceId: camera.deviceId
        }
        this.$axios({
          url: 'http://leas.gtmap.cn/insightPortal/index/getLiveUrl',
          data: Qs.stringify(data),
          method: 'post',
          header: {
            'Content-Type': 'text/x-www-form-urlencoded'
          }
        }).then((response) => {
          if (response.data.success) {
            let flvUrl = response.data.result;
            if (flvjs.isSupported()) {
              let flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: flvUrl
              });
              flvPlayer.attachMediaElement(videoElement);
              flvPlayer.load(); //加载
            }
          }
        }).catch(err => {
          console.log('错误', err);
          this.$message.error("deviceId不存在或错误，请检查",1);
        })
    }
  },
  watch: {
    expandAllNode: {
      handler(newBoolean, oldBoolean) {
        // console.log('new', newBoolean);
        // console.log('old', oldBoolean);
        if (newBoolean) {
          this.expandedKeys = ['0-1', '0-0-2', '0-0-2-6', '0-0-2-6-7', '0-0-2-6-6-1-5', '0-0-3', '0-0-4', '0-0-6']
        } else {
          this.expandedKeys = []
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.myPlayer) {
      this.myPlayer.dispose();
    }
  }
};
</script>

<style scoped>
.back {
  background: url("../../assets/sourceTree-bg.png") no-repeat;
  background-size: 100% 100%;
}

#resourceTree {
  background-color: #7bd2fa;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.h5svideo {
  width: 1920px;
  height: 1080px;
  position: absolute;
  top: 100px;
  left: 200px;
  z-index: 99;
}

.video:hover,
.people:hover,
.locate:hover {
  transform: scale(1.1, 1.1);
}

::v-deep .ant-tree-checkbox {
  float: right !important;
}

.getSum {
  left: 300px;
  top: 0px;
  z-index: 99;
  height: 30px;
}
</style>
