<template>
  <div class="container">
    <div class="cesiumContainer">
      <div id="cesium" style="width:100%;height:100%">
        <div class="success">
          <a-alert
            v-if="visible"
            message="投射成功"
            description="若需要投射下一个视频，请再次点击投射按钮关闭后再进行投射"
            type="success"
            closable
            :after-close="handleClose"
            show-icon
          />
        </div>
      </div>
    </div>
    <div id="bubble" class="bubbleInfo" style="display:none">
      <div id="tools" style="text-align:right">
        <span class="bubble-title">地块属性</span>
        <span title="关闭" id="close"><a-icon type="close-circle" :style="{ fontSize: '25px' }"/></span>
      </div>
      <div id="tableContainer">
      </div>
    </div>
    <div id="tip">正在加载数据，请稍等。。。</div>
  </div>
</template>

<script>
  /* global Cesium */
  export default {
    name: "main",
    $viewer: null,
    data() {
      return {
        visible: false
      }
    },
    mounted() {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOWI4NmU3MS0wNjMwLTRkYzgtODZmOC0wY2IxYzRiYjM3MjciLCJpZCI6MjA5NjIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzg2MjM2MDB9.1N0686jkepigCJiLU3bDFgg5Ti61J943lKpJoqDR2bA'
      // const ellipsolid = new Cesium.Ellipsoid(6378137.0, 6378137.0, 6356752.3142451793)
      // Cesium.Ellipsoid.WGS84 = ellipsolid
      const options = {
        animation: false, // 是否显示动画控件
        baseLayerPicker: false, // 是否显示图层选择控件
        geocoder: false, // 是否显示地名查找控件
        timeline: false, // 是否显示时间线控件
        navigationHelpButton: false, // 是否显示帮助信息控件
        homeButton: false,
        sceneModePicker: false,
        infoBox: false,
        navigation: false,
        creditContainer: null,
        selectionIndicator: false
      }
      const viewer = new Cesium.Viewer('cesium', options)
      viewer.scene.debugShowFramesPerSecond = true //显示帧数
      viewer._cesiumWidget._creditContainer.style.display = 'none'
      //填加viewer和globalData的全局变量方便管理
      window.viewer = viewer;
      window.instanceLayer = new Cesium.InstanceLayer(viewer.scene._context);
      viewer.scene.primitives.add(instanceLayer);
      let globalData = {};
      window.globalData = globalData

      this.inits3m()
      document.body.onselectstart = () => {
        return false
      }
      this.on('showMessage', (val) => {
        this.visible = val
        setTimeout(() => {
          this.visible = false
        }, 6000)
      })
    },
    methods: {
      inits3m() {
        //初始化viewer
        let $scene = viewer.scene
        globalData.imageryLayers = viewer.imageryLayers
        //有关视频投射的实体图层
        globalData.monitorLayer = viewer.entities
        //设置数组管理S3M
        globalData.S3MLayer = []
        //管理投射对象，实现关闭
        globalData.currentProjectionImage = false
        globalData.lastProjectionImage = false
        globalData.projectionArray = []
        //管理实体的点击事件
        globalData.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        //管理标绘对象，包含点、线、面
        globalData.DrawPoint = {}
        globalData.DrawLine = {}
        globalData.DrawPolygon = {}
        globalData.DrawArray = []

        //管理属性查询
        globalData.getAttributeHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        $scene.addS3MTilesLayerByScp(this.urlConfig.MODEL_LIANCHUANG, {
          name: 'LC'
        }).then(layer => {
          layer._selectEnabled = false
          globalData.S3MLayer.push(layer)
        });

        $scene.addS3MTilesLayerByScp(this.urlConfig.MODEL_13FLOOR, {
          name: '13F'
        }).then(layer => {
          layer._selectEnabled = false
          globalData.S3MLayer.push(layer)
        });
        $scene.addS3MTilesLayerByScp(this.urlConfig.MODEL_JN, {
          name: 'JN'
        });
        $scene.addS3MTilesLayerByScp(this.urlConfig.MAP_JZX, {
          name: 'JXZ'
        })
        let provider_MAP_YX = new Cesium.SuperMapImageryProvider({
          url: this.urlConfig.MAP_YX
        });
        let provider_MAP_NJYX = new Cesium.SuperMapImageryProvider({
          url: this.urlConfig.MAP_NJYX
        });

        let provider_MMAP_JZX_DOM = new Cesium.SuperMapImageryProvider({
          url: this.urlConfig.MAP_JZX_DOM
        });
        let jxz_xy = viewer.imageryLayers.addImageryProvider(provider_MMAP_JZX_DOM);
        globalData.imageryLayers.addImageryProvider(provider_MAP_NJYX);
        // let nj_xy = globalData.imageryLayers.addImageryProvider(provider_MAP_YX);

        let jxz_dem = new Cesium.CesiumTerrainProvider({
          url: this.urlConfig.MAP_JZX_DEM,
          isSct: true
        });
        viewer.terrainProvider = jxz_dem;
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(118.707273, 32.021453, 15000),
        })

      },

      handleClose() {
        this.visible = false;
      }
    }
  }


</script>

<style scoped>
  .container{
    height: 100%;
    width: 100%;
  }
  .cesiumContainer {
    height: 100%;
    width: 100%;
  }

  .success {
    position: absolute;
    z-index: 99;
    top: 20px;
    left: 750px;
    width: auto;
  }

  #bubble {
    position: absolute;
    top: 0;
    right: 0;
    width: 330px;
    margin: 0;
    background: rgba(14, 39, 85, 0.7);
    color: rgba(135, 206, 253, 1);
    border: 5px;
    overflow: auto;
  }

  .bubble-title {
    display: inline-block;
    height: 27px;
    margin: 10px 15px;
    font-size: 18px;
    line-height: 27px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(135, 206, 253, 1);
    float: left;
  }

  #close {
    float: right;
    margin: 10px 15px;
  }

  #close:hover {
    cursor: pointer;
  }

  #tableContainer {
    clear: both;
    margin: 15px;
    border: 1px solid #ccc;
  }

  #tip {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    width: 300px;
    height: 40px;
    line-height: 40px;
    color: white;
    font-size: 20px;
    text-align: center;
    border-radius: 5px;
    background-color: rgba(14, 39, 85, 0.7);
    visibility: hidden
  }
</style>
