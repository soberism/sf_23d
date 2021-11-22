<template>
  <div id="caa">
      <div class="miandiv">
        <div class="menu-ctrl-class">
          <a-menu style="width: 350px" mode="horizontal" @click="handleClick" theme="dark" v-if="collapsed">
            <a-sub-menu key="sub1">
              <span slot="title"><a-icon type="column-width"/><span>量测</span></span>
              <a-menu-item key="1">
                距离测量
              </a-menu-item>
              <a-menu-item key="2">
                面积测量
              </a-menu-item>
              <a-menu-item key="3">
                高度测量
              </a-menu-item>
              <a-menu-item key="4">
                清除所有量测
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
              <span slot="title"><a-icon type="tags"/><span>在线标绘</span></span>
              <a-menu-item key="5">
                标绘点
              </a-menu-item>
              <a-menu-item key="6">
                标绘线
              </a-menu-item>
              <a-menu-item key="7">
                标绘面
              </a-menu-item>
              <a-menu-item key="8">
                清除所有标绘
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub3">
              <span slot="title"><a-icon type="scissor"/><span>视频剪裁</span></span>
              <a-menu-item key="9">
                在线剪裁内部
              </a-menu-item>
              <a-menu-item key="10">
                在线剪裁外部
              </a-menu-item>
              <a-menu-item key="11">
                清除剪裁
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </div>
        <a-button style="background-color: #001529;color:#ffffff;height:46px;border: 0px;margin-left: 2px"
                  @click="toggleCollapsed" class="a-btn-class">
          <a-icon type="tool"/>
          <span>工具</span>
        </a-button>
      </div>

      <div class="form-style" v-if="showForm">
        <div class="dilei_info">地类信息表</div>
        <a-form layout="vertical" ref="information_form" :form="form">

          <a-form-item
            label="地类ID"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            required="required"
            help="地类ID是提交必须的条件，不能为空"
          >
            <a-input placeholder="请输入地类ID" style="width: 250px;text-align:left;left: 20px" v-decorator="['dilei_ID',{rules:[{ required:true}]}]"/>
          </a-form-item>

          <a-form-item
            label="地类名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="请输入地类名称" style="width: 250px;text-align:left;left: 20px" ref="dilei_name_info" v-decorator="['dilei_name']"/>
          </a-form-item>

          <a-form-item
            label="地类类型"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="请输入地类类型" style="width: 250px;text-align:left;left: 20px" ref="dilei_type_ifo" v-decorator="['dilei_type']"/>
          </a-form-item>

          <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
            <a-button type="primary" style="left: 60px" @click="handlSubmit">
              提交
            </a-button>
            <a-button type="primary" style="left: 100px;" @click="cancel">
              取消
            </a-button>
          </a-form-item>
        </a-form>
      </div>

  </div>
</template>

<script>
import toolTip from "./tooltip";
import $ from "jquery";

export default {
  data() {
    return {
      collapsed: false,
      clampMode: 0,
      handlerDis: null,
      handlerArea: null,
      handlerHeight: null,
      handlerArray: [],
      Tooltip: {},
      showForm: false,
      form: this.$form.createForm(this, {name: 'information_form'})
    }
  },
  computed: {
    formItemLayout() {
      const {formLayout} = this;
      return formLayout === 'horizontal'
        ? {
          labelCol: {span: 4},
          wrapperCol: {span: 14},
        }
        : {};
    },
    buttonItemLayout() {
      const {formLayout} = this;
      return formLayout === 'horizontal'
        ? {
          wrapperCol: {span: 14, offset: 4},
        }
        : {};
    }
  },
  mounted() {
    this.Tooltip = toolTip.createTooltip(document.body)
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    handleClick(e) {
      if (e.key == '1') {
        globalData.getAttributeHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        this.handlerDis = new Cesium.MeasureHandler(window.viewer, Cesium.MeasureMode.Distance, this.clampMode);
        this.handlerDis.measureEvt.addEventListener((result) => {
          //  console.log(this,'2')
          var dis = Number(result.distance);
          var distance = dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm';
          this.handlerDis.disLabel.text = '距离:' + distance;
          this.clickToQuery()
        });
        this.handlerDis.activeEvt.addEventListener((isActive) => {
          if (isActive == true) {
            window.viewer.enableCursorStyle = false;
            window.viewer._element.style.cursor = 'crosshair';
          } else {
            window.viewer._element.style.cursor = '';
            window.viewer.enableCursorStyle = true;
          }
        });
        this.handlerDis && this.handlerDis.activate();
        this.handlerArray.push(this.handlerDis)
      } else if (e.key == '2') {
        globalData.getAttributeHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        this.handlerArea = new Cesium.MeasureHandler(window.viewer, Cesium.MeasureMode.Area, this.clampMode);
        this.handlerArea.measureEvt.addEventListener((result) => {
          var mj = Number(result.area);
          var area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡'
          this.handlerArea.areaLabel.text = '面积:' + area;
          this.clickToQuery()
        });
        this.handlerArea.activeEvt.addEventListener((isActive) => {
          if (isActive == true) {
            window.viewer.enableCursorStyle = false;
            window.viewer._element.style.cursor = 'crosshair';
          } else {
            window.viewer._element.style.cursor = '';
            window.viewer.enableCursorStyle = true;
          }
        });
        this.handlerArea && this.handlerArea.activate();
        this.handlerArray.push(this.handlerArea)
      } else if (e.key == '3') {
        globalData.getAttributeHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        this.handlerHeight = new Cesium.MeasureHandler(window.viewer, Cesium.MeasureMode.DVH);
        this.handlerHeight.measureEvt.addEventListener((result) => {
          var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
          var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
          var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
          this.handlerHeight.disLabel.text = '空间距离:' + distance;
          this.handlerHeight.vLabel.text = '垂直高度:' + vHeight;
          this.handlerHeight.hLabel.text = '水平距离:' + hDistance;
          this.clickToQuery()
        });
        this.handlerHeight.activeEvt.addEventListener((isActive) => {
          if (isActive == true) {
            window.viewer.enableCursorStyle = false;
            window.viewer._element.style.cursor = 'crosshair';
          } else {
            window.viewer._element.style.cursor = '';
            window.viewer.enableCursorStyle = true;
          }
        });
        this.handlerHeight && this.handlerHeight.activate();
        this.handlerArray.push(this.handlerHeight)
      } else if (e.key == '4') {
        this.handlerArray.forEach((item) => {
          item.clear()
        })
        // this.handlerDis && this.handlerDis.clear();
        // this.handlerArea && this.handlerArea.clear();
        // this.handlerHeight && this.handlerHeight.clear();
      } else if (e.key == '5') {
        globalData.DrawLine.isActive && globalData.DrawLine.deactivate()
        globalData.DrawLine.isActive = false
        globalData.DrawPolygon.isActive && globalData.DrawPolygon.deactivate()
        globalData.DrawPolygon.isActive = false
        this.drawPoint(this.Tooltip)
        globalData.DrawPoint.activate()
      } else if (e.key == '6') {
        globalData.DrawPoint.isActive && globalData.DrawPoint.deactivate()
        globalData.DrawPoint.isActive = false
        globalData.DrawPolygon.isActive && globalData.DrawPolygon.deactivate()
        globalData.DrawPolygon.isActive = false
        this.drawLine(this.Tooltip)
        globalData.DrawLine.activate()
      } else if (e.key == '7') {
        globalData.DrawLine.isActive && globalData.DrawLine.deactivate()
        globalData.DrawLine.isActive = false
        globalData.DrawPoint.isActive && globalData.DrawPoint.deactivate()
        globalData.DrawPoint.isActive = false
        this.drawPolygon(this.Tooltip)
        globalData.DrawPolygon.activate()
      } else if (e.key == '8') {
        this.deactivateAll()
        this.clearAll()
        globalData.DrawArray.forEach((s)=>{
          viewer.entities.removeById(s.id)
        })
        this.showForm = false
        viewer._element.style.cursor = ''
        viewer.enableCursorStyle = true
      } else if (e.key == '9' || e.key == '10') {
        if (globalData.projectionArray.length > 0 && globalData.projectionArray[0].distance > 1) {
          // console.log( globalData.projectionArray)
          var handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, Cesium.ClampMode.Space);
          handlerPolygon.enableDepthTest = false;
          handlerPolygon.drawEvt.addEventListener(function (result) {
            var array = [].concat(result.object.positions);
            var positions = [];
            for (var i = 0, len = array.length; i < len; i++) {
              var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
              var longitude = Cesium.Math.toDegrees(cartographic.longitude);
              var latitude = Cesium.Math.toDegrees(cartographic.latitude);
              var h = cartographic.height;
              if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
                positions.push(longitude);
                positions.push(latitude);
                positions.push(h);
              }
            }
            var clipMode;
            if (e.key == '9') {
              clipMode = Cesium.ModifyRegionMode.CLIP_INSIDE
            } else {
              clipMode = Cesium.ModifyRegionMode.CLIP_OUTSIDE
            }
            globalData.projectionArray[0].setClipMode(clipMode)
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            globalData.projectionArray[0].addClipRegion({name: 'test', position: positions});
            handlerPolygon.deactivate();
          });
          handlerPolygon.activeEvt.addEventListener((isActive) => {
            if (isActive == true) {
              viewer.enableCursorStyle = false;
              viewer._element.style.cursor = 'crosshair';
            } else {
              viewer._element.style.cursor = '';
              viewer.enableCursorStyle = true;
            }
          });
          handlerPolygon.activate();
        } else {
          this.$message.success('请先进行投影', 1,);
        }

      } else if (e.key == '11') {
        globalData.projectionArray[0].removeAllClipRegion()
      }
    },
    drawPoint(Tooltip) {
      globalData.getAttributeHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      globalData.DrawPoint = new Cesium.DrawHandler(viewer, 0, 1)
      globalData.DrawPoint.enableDepthTest = false
      globalData.DrawPoint.isActive = true
      //1、修改鼠标样式
      globalData.DrawPoint.activeEvt.addEventListener((isActive) => {
        console.log(isActive);
        if (isActive) {
          viewer.enableCursorStyle = false
          viewer._element.style.cursor = ''
          document.body.classList.add('drawCur');
        } else {
          viewer._element.style.cursor = ''
          viewer.enableCursorStyle = true
        }
      })
      //2、监听鼠标移动跟随鼠标填加提示
      globalData.DrawPoint.movingEvt.addEventListener((windowPosition) => {
        Tooltip.showAt(windowPosition, '<p>点击绘制你所需要标绘的点</p>')
      })
      //3、标绘
      globalData.DrawPoint.drawEvt.addEventListener((result) => {
        Tooltip.setVisible(false)
        //console.log(result);
        let DRAWENTITY
        let pointPosition = result.object.position
        DRAWENTITY = viewer.entities.add({
          name: 'Point',
          position: pointPosition,
          point: {
            show: true,
            color: Cesium.Color.RED,
            pixelSize: 16,
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,//去除地形遮挡
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
          },
          label: {
            text: "",
            font: '25px Helvetica',
            fillColor: Cesium.Color.BLACK,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            pixelOffset: Cesium.Cartesian2(25, 75)
          }
        })
        globalData.DrawArray.push(DRAWENTITY)
        this.clearAll()
        this.showForm = true
        this.clickToQuery()
      })
    },
    drawLine(Tooltip) {
      globalData.getAttributeHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      globalData.DrawLine = new Cesium.DrawHandler(viewer, 1, 1)
      globalData.DrawLine.enableDepthTest = false
      globalData.DrawLine.isActive = true
      //1、修改鼠标样式
      globalData.DrawLine.activeEvt.addEventListener((isActive) => {
        console.log(isActive);
        if (isActive) {
          viewer.enableCursorStyle = false
          viewer._element.style.cursor = ''
          document.body.classList.add('drawCur');
        } else {
          viewer._element.style.cursor = ''
          viewer.enableCursorStyle = true
        }

      })
      //2、监听鼠标移动跟随鼠标填加提示
      globalData.DrawLine.movingEvt.addEventListener((windowPosition) => {
        if (globalData.DrawLine.isDrawing) {
          Tooltip.showAt(windowPosition, '<p>左键点击确定折线中间点</p><p>右键单击结束绘制</p>')
        } else {
          Tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
        }
      })
      //3、标绘
      globalData.DrawLine.drawEvt.addEventListener((result) => {
        Tooltip.setVisible(false)
        //console.log(result.object.positions);
        if (result) {
          let DRAWENTITY
          let polyLinePosition = result.object.positions
          DRAWENTITY = viewer.entities.add({
            name: 'polyLine',
            position: this.caculLabelPosition(polyLinePosition), //必须给实体一个坐标否则这个实体在场景里没有坐标就无法填加label
            polyline: {
              positions: polyLinePosition,
              show: true,
              material: Cesium.Color.YELLOW,
              width: 3,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
            },
            label: {
              text: "",
              font: '25px Helvetica',
              fillColor: Cesium.Color.BLACK,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              pixelOffset: Cesium.Cartesian2(25, 75)
            }
          })
          globalData.DrawArray.push(DRAWENTITY)
          this.clearAll()
          this.showForm = true
          this.clickToQuery()
        }
      })
    },
    drawPolygon(Tooltip) {
      globalData.getAttributeHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      globalData.DrawPolygon = new Cesium.DrawHandler(viewer, 2, 1)
      globalData.DrawPolygon.enableDepthTest = false
      globalData.DrawPolygon.isActive = true
      //1、修改鼠标样式
      globalData.DrawPolygon.activeEvt.addEventListener((isActive) => {
        console.log(isActive);
        if (isActive) {
          viewer.enableCursorStyle = false
          viewer._element.style.cursor = ''
          document.body.classList.add('drawCur');
        } else {
          viewer._element.style.cursor = ''
          viewer.enableCursorStyle = true
        }

      })
      //2、监听鼠标移动跟随鼠标填加提示
      globalData.DrawPolygon.movingEvt.addEventListener((windowPosition) => {
        if (globalData.DrawPolygon.isDrawing) {
          Tooltip.showAt(windowPosition, '<p>点击确定多边形中间点</p><p>右键单击结束绘制</p>')
        } else {
          Tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
        }
      })
      //3、标绘
      globalData.DrawPolygon.drawEvt.addEventListener((result) => {
        Tooltip.setVisible(false)
        //console.log(result.object);
        if (result) {
          let DRAWENTITY
          let polygonHierarchy = result.object.polygon.hierarchy
          DRAWENTITY = viewer.entities.add({
            name: 'Polygon',
            position: this.caculLabelPosition(polygonHierarchy._value.positions),
            polygon: {
              material: Cesium.Color.GREEN.withAlpha(0.01),
              hierarchy: polygonHierarchy,
              show: true,
              outline: true,
              outlineColor: Cesium.Color.RED,
              outlineWidth: 2,
              perPositionHeight: true
            },
            label: {
              text: "",
              font: '25px Helvetica',
              fillColor: Cesium.Color.BLACK,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              pixelOffset: Cesium.Cartesian2(25, 75)
            }
          })
          globalData.DrawArray.push(DRAWENTITY)
          this.clearAll()
          this.showForm = true
          this.clickToQuery()
        }
      })
    },
    clearAll() {
      if (globalData.DrawLine.isActive) {
        globalData.DrawLine.clear()
      } else if (globalData.DrawPoint.isActive) {
        globalData.DrawPoint.clear()
      } else if (globalData.DrawPolygon.isActive) {
        globalData.DrawPolygon.clear()
      }
    },
    deactivateAll() {
      if (globalData.DrawLine.isActive) {
        globalData.DrawLine.deactivate()
      } else if (globalData.DrawPoint.isActive) {
        globalData.DrawPoint.deactivate()
      } else if (globalData.DrawPolygon.isActive) {
        globalData.DrawPolygon.deactivate()
      }
    },
    cancel() {
      this.form.resetFields()
      this.showForm = false
      viewer.entities.removeById(globalData.DrawArray[globalData.DrawArray.length - 1].id)
      document.body.classList.remove('drawCur');
    },
    handlSubmit() {
      globalData.DrawArray[globalData.DrawArray.length - 1].label.text = this.form.getFieldValue('dilei_ID')
      this.form.resetFields()
      this.showForm = false
      document.body.classList.remove('drawCur');
    },
    caculLabelPosition(position) {
      let point = {
        x: 0.0,
        y: 0.0,
        z: 0.0
      }
      for (let i = 0; i < position.length; i++) {
        point.x += position[i].x
        point.y += position[i].y
        point.z += position[i].z
      }
      point.x = point.x / position.length
      point.y = point.y / position.length
      point.z = point.z / position.length
      return point
    },
    clickToQuery(){
      globalData.getAttributeHandler.setInputAction((e)=>{
        //取消之前选中的高亮实体
        if (this.tempSelectFeature != null) {
          console.log(this.tempSelectFeature)
          if (this.tempSelectFeature.name == "BP") {
            this.tempSelectFeature.polygon.material = Cesium.Color.BLUE.withAlpha(0.01);
            this.tempSelectFeature.polygon.outline = true;
            this.tempSelectFeature.polygon.outlineColor = Cesium.Color.BLUE
          } else if (this.tempSelectFeature.name == "GD") {
            this.tempSelectFeature.polygon.material = Cesium.Color.RED.withAlpha(0.01);
            this.tempSelectFeature.polygon.outline = true;
            this.tempSelectFeature.polygon.outlineColor = Cesium.Color.RED
          }
          this.tempSelectFeature = null;
        }
        var selectFeature = viewer.scene.pick(e.position);//场景拾取，返回在场景中该窗口位置对应的第一个图元对象，如果该位置没有任何物体则返回undefined。
        var des = '';//地块信息
        if (selectFeature && selectFeature.id && selectFeature.id.polygon && selectFeature.id.name != "Polygon") {//选择地块
          selectFeature.id.polygon.material = Cesium.Color.RED.withAlpha(0.3);
          this.tempSelectFeature = selectFeature.id;
          //第一行
          des = '<table id="popustyle" border="1px solid #ccc" cellspacing="0" cellpadding="0">';
          if (selectFeature.id.fieldName) {
            for (var i = 0; i < selectFeature.id.fieldName.length; i++) {
              //中间n行
              des += '<tr align="left" style="font-size: 14px;line-height: 21px"><td style="width: 25%">' + selectFeature.id.fieldName[i] + '</td><td style="width: 75%">' + selectFeature.id.fieldValue[i] + '</td></tr>';
            }
            //最后一行
            des += "</table>";
            $('#tableContainer').html(des);
            let div_height = $("body").height() - 30;
            $("#bubble").css("max-height", div_height);
            $("#bubble").show()
            $("#close").click(function () {
              $("#bubble").hide();
            })
          }
        } else {//未选中地块
          $("#bubble").hide();
          this.tempSelectFeature = null
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  },
};

</script>
<style>

.miandiv {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0px;
  right: 0px;
}


.twipsy {
  display: block;
  position: absolute;
  visibility: visible;
  max-width: 300px;
  min-width: 100px;
  padding: 5px;
  font-size: 11px;
  z-index: 1000;
  opacity: 0.8;
  -khtml-opacity: 0.8;
  -moz-opacity: 0.8;
  filter: alpha(opacity=80);
}

.twipsy.left .twipsy-arrow {
  top: 50%;
  right: 0;
  margin-top: -5px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #000000;
}

.twipsy.right .twipsy-arrow {
  top: 50%;
  left: 0;
  margin-top: -5px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #000000;
}

.twipsy-inner {
  padding: 3px 8px;
  background-color: #000000;
  color: white;
  text-align: center;
  max-width: 300px;
  text-decoration: none;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

.twipsy-arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.form-style {
  position: relative;
  top: 200px;
  right: 200px;
  width: 300px;
  height: 380px;
  z-index: 99;
  background: rgba(14, 39, 85, 0.8);
}

.ant-form-item-label > label {
  color: white !important;
  font-size: 16px !important;
  font-family: Microsoft YaHei !important;
  left: 15px !important;
}

.dilei_info {
  font-size: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  text-align: center;
  color: white;
}

.ant-form-vertical .ant-form-explain {
  position: relative;
  color: deeppink !important;
  left: 20px;
}

.drawCur {
  cursor: url('../../assets/draw.cur'), auto;
}
</style>
