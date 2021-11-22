import axios from 'axios'
import HeatMapLayer from './heatmap/HeatMapLayer'

window.peopleFlowEntities = [];
window.manModelId = []

function _sortRule(props) {
  return function (a, b) {
    return a[props] - b[props];
  }
}

function _removeDuplicates(arr) {
  const result = [];
  const duplicatesIndices = [];
  arr.forEach((current, index) => {
    if (duplicatesIndices.includes(index)) return;
    result.push(current);
    for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
      const comparison = arr[comparisonIndex];
      const currentKeys = Object.keys(current);
      const comparisonKeys = Object.keys(comparison);
      if (currentKeys.length !== comparisonKeys.length) continue;
      const currentKeysString = currentKeys.sort().join("").toLowerCase();
      const comparisonKeysString = comparisonKeys.sort().join("").toLowerCase();
      if (currentKeysString !== comparisonKeysString) continue;
      let valuesEqual = true;
      for (let i = 0; i < currentKeys.length; i++) {
        const key = currentKeys[i];
        if (current[key] !== comparison[key]) {
          valuesEqual = false;
          break;
        }
      }
      if (valuesEqual) duplicatesIndices.push(comparisonIndex);
    }
  });

  return result;
}

function _arrayCnt(arr) {
  let resultArr = [];
  let idArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (idArr.indexOf(arr[i]) == -1) {
      idArr.push(arr[i])
    }
  }
  let numArr = new Array(idArr.length);
  for (let t = 0; t < numArr.length; t++) {
    numArr[t] = 0;
  }
  for (let p = 0; p < idArr.length; p++) {
    for (let j = 0; j < arr.length; j++) {
      if (idArr[p].taskID == arr[j].taskID) {
        numArr[p]++;
      }
    }
  }
  for (let m = 0; m < idArr.length; m++) {
    let one = {};
    one.taskID = idArr[m].taskID;
    one.peopleNUM = numArr[m];
    resultArr.push(one);
  }
  return resultArr
}

//添加人模型
function _addManModel(longitude, latitude, altitude, n) {
  manModelId.push(n)
  let url = "http://192.168.2.155:8080/s3m/modelNames.json";
  let defaultUrl = "http://192.168.2.155:8080/s3m/";
  axios.get(url)
    .then(response => {
        let modelNames = response.data.modeList
        let index = Math.floor(Math.random() * (modelNames.length)) + 1
        let modelName = modelNames[index - 1]
        instanceLayer.add(defaultUrl + modelName, {
          position: new Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
          hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
          scale: new Cesium.Cartesian3(0.01, 0.01, 0.01),
          id: n
        });
      }
    )
    .catch(function (err) {
      // console.log("摄像头参数失败");
    });
}

function addPeoplesByLatest(instanceLayer, peoples) {
  // removePeoples();
  removeManModel()
  peoples = peoples.sort(_sortRule('longitude'))
  let n = 0;
  console.log(peoples);
  window.timer = setInterval(function () {
    if (n < peoples.length) {
      // _addEntityModel(viewer, parseFloat(peoples[n].longitude), parseFloat(peoples[n].latitude), 47.48)
      _addManModel(parseFloat(peoples[n].longitude), parseFloat(peoples[n].latitude), parseFloat(peoples[n].altitude), n)
      n++;
    }
  }, 5000 / peoples.length)

}

function addPeoplesByMoment(viewer, moment, currentCameraTopFive) {
  // removePeoples()
  removeManModel()
  let longitudeCenter = 0.0;
  let latitudeCenter = 0.0;
  let altitudeCenter = 0.0;
  for (let n = 0; n < currentCameraTopFive.info[moment].peopleNum; n++) {
    let longitude = parseFloat(currentCameraTopFive.info[moment].peoples[n].longitude);
    let latitude = parseFloat(currentCameraTopFive.info[moment].peoples[n].latitude);
    let altitude = parseFloat(currentCameraTopFive.info[moment].peoples[n].altitude);
    // console.log(longitude, latitude, altitude)
    longitudeCenter = longitudeCenter + longitude;
    latitudeCenter = latitudeCenter + latitude;
    altitudeCenter = altitudeCenter + altitude;
    _addManModel(longitude, latitude, altitude, n);
  }
  longitudeCenter = longitudeCenter / currentCameraTopFive.info[moment].peopleNum;
  latitudeCenter = latitudeCenter / currentCameraTopFive.info[moment].peopleNum;
  altitudeCenter = altitudeCenter / currentCameraTopFive.info[moment].peopleNum;
  viewer.camera.flyTo({
    duration: 2,
    destination: Cesium.Cartesian3.fromDegrees(longitudeCenter, latitudeCenter, altitudeCenter + 100),
    orientation: {
      pitch: Cesium.Math.toRadians(-90),
      roll: 0
    }
  });
}

function removePeoples() {
  for (let i = 0; i < window.peopleFlowEntities.length; i++) {
    window.viewer.entities.remove(window.peopleFlowEntities[i]);
  }
  window.peopleFlowEntities.length = 0;
}

function removeManModel() {
  instanceLayer.removeAll()
}

function getHeatMapData(cameraTopFive) {
  window.heatMapDatas = [];//最近五个时刻热力图数据
  window.heatMapBounds = [];//最近五个时刻格网范围
  window.heatMapMaxValues = [];//最近五个时刻热力图数据最大值
  window.grids = [];//最近五个时刻格网，通过和cameraTopFivePeoples位置比较，计算热力图数据value
  let cameraTopFivePeoples = [];
  let cameraTopFiveRectangles = [];

  let gridsCenter = [];//最近五个时刻格网中心，即热力图数据的xy
  for (let j = 0; j < cameraTopFive.info.length; j++) {
    // cameraTopFivePeoples：一个时刻人数集，为了计算每个时刻每个格网的人数
    cameraTopFivePeoples = cameraTopFive.info[j].peoples
    let cameraTopFiveHeatMapData = [];//一个时刻的热力图数据
    let cameraTopFiveRectangle = {};//一个时刻人数矩形范围
    let heatMapMaxValue = 0;//一个时刻热力图数据最大值
    let longitudes = []
    let latitudes = [];
    for (let index in cameraTopFivePeoples) {
      let people = cameraTopFivePeoples[index]
      longitudes.push(people.longitude);
      latitudes.push(people.latitude)
    }
    cameraTopFiveRectangle.west = Math.min.apply(null, longitudes);
    cameraTopFiveRectangle.east = Math.max.apply(null, longitudes);
    cameraTopFiveRectangle.south = Math.min.apply(null, latitudes);
    cameraTopFiveRectangle.north = Math.max.apply(null, latitudes);
    cameraTopFiveRectangles.push(cameraTopFiveRectangle);
    let grid = [];//一个时刻格网
    let gridCenter = [];//一个时刻格网中心
    let gridLongitudeMax = cameraTopFiveRectangle.east + 0.00001;
    let gridLongitudeMin = cameraTopFiveRectangle.west - 0.00001;
    let gridLatitudeMax = cameraTopFiveRectangle.north + 0.00001;
    let gridLatitudeMin = cameraTopFiveRectangle.south - 0.00001;
    let gridLongitudeDelte = gridLongitudeMax - gridLongitudeMin;
    let gridLatitudeDelte = gridLatitudeMax - gridLatitudeMin;
    let gridLongitudeStep = gridLongitudeDelte / 4;
    let gridLatitudeStep = gridLatitudeDelte / 4;
    let heatMapBound = {};//一个时刻热力图范围，根据格网来算
    let gridLongitudes = []
    let gridLatitudes = []
    //计算一个时刻格网
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        let point = {};
        point.longitude = gridLongitudeMin + i * gridLongitudeStep;
        point.latitude = gridLatitudeMin + j * gridLatitudeStep;
        grid.push(point);
      }
    }

    //计算一个时刻热力图范围
    for (let i = 0; i < grid.length; i++) {
      gridLongitudes.push(grid[i].longitude);
      gridLatitudes.push(grid[i].latitude);
    }
    heatMapBound.west = Math.min.apply(null, gridLongitudes);
    heatMapBound.east = Math.max.apply(null, gridLongitudes);
    heatMapBound.south = Math.min.apply(null, gridLatitudes);
    heatMapBound.north = Math.max.apply(null, gridLatitudes);
    window.heatMapBounds.push(heatMapBound);
    window.grids.push(grid)
    //计算一个时刻格网中心点
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let point = {};
        point.longitude = grid[i * 5 + j].longitude + gridLongitudeStep / 2;
        point.latitude = grid[i * 5 + j].latitude + gridLatitudeStep / 2;
        gridCenter.push(point);
      }
    }
    gridsCenter.push(gridCenter);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let value = 0;
        for (let n = 0; n < cameraTopFivePeoples.length; n++) {
          if (grid[i * 5 + j].longitude < cameraTopFivePeoples[n].longitude && grid[i * 5 + j + 6].longitude >= cameraTopFivePeoples[n].longitude) {
            if (grid[i * 5 + j].latitude < cameraTopFivePeoples[n].latitude && grid[i * 5 + j + 6].latitude >= cameraTopFivePeoples[n].latitude) {
              value++
            }
          }
        }
        if (value > 0) {
          if (heatMapMaxValue < value) {
            heatMapMaxValue = value;
          }
          let heatMapPoint = {};
          heatMapPoint.x = gridCenter[i * 4 + j].longitude;
          heatMapPoint.y = gridCenter[i * 4 + j].latitude;
          heatMapPoint.value = value;
          cameraTopFiveHeatMapData.push(heatMapPoint);
        }
      }
    }
    //最近五个时刻热力图数据和最大值
    window.heatMapMaxValues.push(heatMapMaxValue);
    window.heatMapDatas.push(cameraTopFiveHeatMapData);
  }
}

function addGridEntity(grid) {
  for (let index in grid) {
    let gridEntity = new Cesium.Entity({
      name: "point",
      position: Cesium.Cartesian3.fromDegrees(grid[index].longitude, grid[index].latitude, 51),
      point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW
      }
    });
    viewer.entities.add(gridEntity);
  }

}

function addGridCenterEntity(grid) {
  for (let index in grid) {
    let gridEntity = new Cesium.Entity({
      name: "point",
      position: Cesium.Cartesian3.fromDegrees(grid[index].x, grid[index].y, 51),
      point: {
        pixelSize: 20,
        color: Cesium.Color.RED
      }
    });
    viewer.entities.add(gridEntity);
  }

}

function createHeatMap(typeStr, minValue, maxValue, data, rectangle) {
  removeHeatMap();
  if (typeStr == 'TJ') {
    let heatmapInstanceTJ = new HeatMapLayer(
      window.viewer,
      rectangle,
      {
        maxOpacity: 0.95,
        gradient: {
          0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "rgb(255,255,0)", 1.0: "rgb(255,0,0)"
        },
        radius: 10,
        // height: 0,
        clampToGround: true,
        clampToS3M: true
      }
    );
    heatmapInstanceTJ.setData(minValue, maxValue, data);
    window.heatmapInstanceTJ = heatmapInstanceTJ
  }
  if (typeStr == 'RLFY') {
    let heatmapInstanceRLFY = new HeatMapLayer(
      window.viewer,
      rectangle,
      {
        maxOpacity: 0.95,
        gradient: {
          0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "rgb(255,255,0)", 1.0: "rgb(255,0,0)"
        },
        radius: 200,
        // height: 0,
        clampToGround: true,
        clampToS3M: true
      }
    );
    heatmapInstanceRLFY.setData(minValue, maxValue, data);
    window.heatmapInstanceRLFY = heatmapInstanceRLFY
  }
  // return heatmapInstance;
}

function removeHeatMap() {
  window.heatmapInstanceTJ && window.heatmapInstanceTJ.remove();
  window.heatmapInstanceTJ = null;
  window.heatmapInstanceRLFY && window.heatmapInstanceRLFY.remove();
  window.heatmapInstanceRLFY = null;
}

export default {
  addPeoplesByLatest,
  addPeoplesByMoment,
  removePeoples,
  getHeatMapData,
  createHeatMap,
  removeHeatMap,
  removeManModel
}
