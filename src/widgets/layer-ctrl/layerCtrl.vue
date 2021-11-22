<template>
  <div id="layer" v-show="isShowLayerManage">
    <a-tree :tree-data="layerList" checkable @check="onCheck">
    </a-tree>
  </div>
</template>

<script>
/* global Cesium */
import $ from 'jquery'
import axios from "axios";

export default {
  name: "",
  data() {
    return {
      isShowLayerManage: false,
      layerList: [],
      dataSetUrl: 'http://192.168.60.45:8099/iserver/services/data-Tongcheng/rest/data/datasources/Tongcheng/datasets.json',
      dataSourceUrl: 'http://192.168.60.45:8099/iserver/services/data-Tongcheng/rest/data/datasources.json',
      dataSource: '',
      parent: {},
      materialList: {
        'GDDK': [Cesium.Color.DARKORANGE.withAlpha(0.01), Cesium.Color.DARKORANGE.withAlpha(1)],
        'BPDK': [Cesium.Color.RED.withAlpha(0.01), Cesium.Color.RED.withAlpha(1)]
      },
      labelList: [6, 10],
      layerCenter: [],
      tempSelectFeature: null,
      //管理图层管理实体集
      dataSourceGD: new Cesium.CustomDataSource("GD"),
      dataSourceBP: new Cesium.CustomDataSource("BP")
    }
  },
  mounted() {
    let _this = this;
    //获取图层管理目录树
    axios
      .get(this.getLayerListUrl)
      .then(response => {
        this.layerList = response.data.layers;
      })
      .catch(function (err) {
        this.$message.error("获取图层管理目录树失败");
      });
    this.on('isShowLayerManage', (isShowLayerManage) => {
      this.isShowLayerManage = isShowLayerManage
    });
  },
  methods: {
    getLayerFeatures(Cesium, viewer, customDataSource, dataSource, dataset) {
      //（1）获取数据服务字段别名
      let selectedField = []
      let url = "http://192.168.2.155:8090/iserver/services/data-NJGD-2/rest/data/datasources/" + dataSource + "/datasets/" + dataset + "/fields.rjson?returnAll=true"
      $("#tip").css("visibility", "visible");
      $.ajax({
        type: "get",
        url: url,
        success: function (result) {
          let allField = JSON.parse(result)
          for (let i = 0; i < allField.length; i++) {
            if (allField[i].name != allField[i].caption) {
              let field = {};
              field.name = allField[i].name.toUpperCase()
              field.caption = allField[i].caption
              selectedField.push(field)
            }
          }
          //（2）查询数据服务
          var data = JSON.stringify({
            "getFeatureMode": "SQL",
            "datasetNames": [dataSource + ":" + dataset],
            "queryParameter": {
              "attributeFilter": "SMID&gt;0",
            },
            "maxFeatures": 10000
          })
          $.ajax({
            type: "post",
            url: "http://192.168.2.155:8090/iserver/services/data-NJGD-2/rest/data/featureResults.rjson?returnContent=true",
            data: data,
            success: function (result) {
              var resultObj = JSON.parse(result)
              var selectedFeatures = resultObj.features
              for (let i = 0; i < selectedFeatures.length; i++) {
                let selectedFeature = selectedFeatures[i];
                let points = selectedFeature.geometry.points;
                let center = selectedFeature.geometry.center;
                let fieldName = []
                let fieldValue = []
                for (let n = 0; n < selectedFeature.fieldNames.length; n++) {
                  for (let k = 0; k < selectedField.length; k++) {
                    if (selectedFeature.fieldNames[n] == selectedField[k].name) {
                      fieldName.push(selectedField[k].caption)
                      fieldValue.push(selectedFeature.fieldValues[n])
                    }
                  }
                }
                let positions = [];
                let points_str = JSON.stringify(points).replace(/{/g, '').replace(/}/g, '').replace(/"x":/g, '').replace(/"y":/g, '').replace(/\[|]/g, '');
                let points_arr = points_str.split(",").map(Number);
                for (let j = 0; j < points_arr.length - 1; j = j + 2) {
                  positions.push(points_arr[j]);
                  positions.push(points_arr[j + 1]);
                }
                positions = positions.map(Number);
                let material = null;
                let outlineColor = null
                let name = ''
                if (dataset == "GD") {
                  material = Cesium.Color.RED.withAlpha(0.01);
                  outlineColor = Cesium.Color.RED
                  name = "GD"
                } else if (dataset == "BP") {
                  material = Cesium.Color.BLUE.withAlpha(0.01)
                  outlineColor = Cesium.Color.BLUE
                  name = "BP"
                }
                // 绘制面
                let entity = customDataSource.entities.add({
                  name: dataset,
                  position: Cesium.Cartesian3.fromDegrees(center.x, center.y),
                  polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(positions),
                    material: material,
                    outline: true,
                    outlineColor: outlineColor,
                    height: 10,
                    outlineWidth:4,
                  },
                  fieldName: fieldName,
                  fieldValue: fieldValue,
                  clampToS3M: true,
                  clampToGround: true
                });
                viewer.dataSources.add(customDataSource);
              }
              viewer.flyTo(customDataSource);
              $("#tip").css("visibility", "hidden");
            }, error: function (err) {
              console.log(error)
              alert("获取图层数据失败！")
            }
          })
        },
        error: function (error) {
          console.log(error)
          alert("获取图层字段别名失败！")
        }
      })
    },
    onCheck(checkedKeys, info) {
      $("#bubble").hide()
      console.log(checkedKeys)
      if (checkedKeys.length == 1) {
        if (checkedKeys[0] == "GD") {
          this.dataSourceBP.entities.removeAll()
          this.getLayerFeatures(Cesium, viewer, this.dataSourceGD, "供地报批", checkedKeys[0])
        } else if (checkedKeys[0] == "BP") {
          this.dataSourceGD.entities.removeAll()
          this.getLayerFeatures(Cesium, viewer, this.dataSourceBP, "供地报批", checkedKeys[0])
        }
      } else if (checkedKeys.length > 1) {
        for (let item in checkedKeys) {
          if (checkedKeys[item] == "GD") {
            this.getLayerFeatures(Cesium, viewer, this.dataSourceGD, "供地报批", checkedKeys[item])
          } else if (checkedKeys[item] == "BP") {
            this.getLayerFeatures(Cesium, viewer, this.dataSourceBP, "供地报批", checkedKeys[item])
          }
        }
      } else if (checkedKeys.length == 0) {
        this.dataSourceGD.entities.removeAll()
        this.dataSourceBP.entities.removeAll()
        globalData.getAttributeHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      }
      this.clickToQuery()
    },
    clickToQuery() {
      let lastSelectFeature = null;
      let _this = this;
      globalData.getAttributeHandler.setInputAction((e) => {
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
          des = '<table id="popustyle" border="1px solid #ccc" width="100%" cellspacing="0" cellpadding="0">';
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
  }
}
</script>

<style scoped>
#layer {
  background: url("../../assets/sourceTree-bg.png") no-repeat;
  background-size: 100% 100%;
  background-color: #7bd2fa;
  width: 100%;
  height: 100%;
  overflow: auto;
}

#DKInfo {
  position: fixed;
  top: 20px;
  right: 10px;
  width: 200px;
  height: 200px;
  z-index: 999;
}
</style>
