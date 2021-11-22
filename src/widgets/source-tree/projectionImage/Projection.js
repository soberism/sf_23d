import h5sPlayer from './h5sPlayer-mini'

/**
 * 填加图片实体以及执行视频投射
 * **/
function addbillboaed(id, position) {
  let marker;
  marker = globalData.monitorLayer
  marker.add({
    id: id,
    name: 'Projection Picture',
    position: Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.alt + 11), //按照这种方式传入
    billboard: {
      image: require('../../../assets/images/icon/ic_shipin.png'),
      width: 2 * 14,
      height: 2.29 * 14,
    }
  });
}

function setViewpoint(longitude, latitude, altitude, direction, pitch) {
  viewer.scene.camera.flyTo({
    duration: 2,
    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
    orientation: {
      heading: Cesium.Math.toRadians(direction),
      pitch: Cesium.Math.toRadians(pitch),
      roll: 0
    }
  })
};

function addGlowPolyline(lineID, P) {
  let Polyline = globalData.monitorLayer
  Polyline.add({
    name: "发光实体",
    id: lineID,
    polyline: {
      show: true,
      width: 3,
      material: Cesium.Color.WHITE,
      positions: P,
    }
  })
};

/***
 * 找到LC图层
 * */
function checkLCModule(Array) {
  for (let item of Array) {
    if (item.name == "LC") {
      return item
    }
  }
};

/**
 * H5解析rtsp
 * **/
function setH5sVideoSource(config) {
  let v = h5sPlayer.H5sPlayerCreate(config)
  if (v != null) {
    v.disconnect();
    h5sPlayer.remove(v)
    v = null;
  }
  v = h5sPlayer.H5sPlayerCreate(config)
  v.connect();
};

/***
 * 执行投射
 * */
function projectionImage(id, longitude, latitude, altitude, direction, pitch, verticalFOV, horizontalFOV, distance, videoElement) {
  setTimeout(() => {
    let projectionImage = new Cesium.ProjectionImage(viewer.scene);
    //设置视点位置
    projectionImage.viewPosition = [longitude, latitude, altitude];
    projectionImage.direction = direction;
    projectionImage.pitch = pitch;
    projectionImage.verticalFov = verticalFOV;
    projectionImage.horizontalFov = horizontalFOV;
    projectionImage.distance = distance;
    projectionImage.hintLineVisible = false;
    projectionImage.hintLineColor = new Cesium.Color(0, 0, 0, 1);
    projectionImage.setImage({
      video: videoElement
    });
    projectionImage.id = id
    //执行视频投放分析
    projectionImage.build();
    //全局管理projectionImage
    console.log(projectionImage);
    globalData.projectionArray.push(projectionImage)
  }, 4000)
  //投放分析后飞行到投放位置，方便查看
  setViewpoint(longitude, latitude, altitude, direction, pitch)
}

/***
 * 合并填加实体线和实体的方法
 */
function addEntities(id, lineID, position) {
  //填加实体线
  let Polyline = []
  let start = Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.alt)
  Polyline.push(start)
  let end = Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.alt + 11)
  Polyline.push(end)
  addbillboaed(id, position) //显示摄像头图标实体
  addGlowPolyline(lineID, Polyline)
}

/**
 * 删除实体
 * */
function deleteEntities() {
  let markers = globalData.monitorLayer //拿到所有的实体集合
  markers.removeAll() //删除所有实体
}

/**
 * 关闭视频投射
 * */
function removeProjection(projectionImage, id) {
  if (!projectionImage) {
    return;
  }
  for (let i=0;i<projectionImage.length;i++) {
    if (projectionImage[i].id === id) {
      projectionImage[i].destroy()
    }
  }
  globalData.projectionArray = []
}

/**
 * 显示联创模型
 * */
function showLCModel(Array) {
  for (let item of Array) {
    if (item.name === "LC") {
      item.visible = true
    }
  }
}

/**
 * 关闭全部视频投射
 * */
function removeAllProjection(projectionImageArray) {
  if (projectionImageArray.length>0) {
    for (let i = 0; i < projectionImageArray.length; i++) {
      projectionImageArray[i].destroy()
    }
  }
  globalData.projectionArray = []
}

/**
 * 判断ID进行定位
 * */
function location(id, CAMERA_CONFIG) {
  //1.根据这个id拿到对应的位置信息
  let site = {}
  for (let item in CAMERA_CONFIG) { //这样只能拿到对应的key值，拿value还需要CAMERA_CONFIG[item]
    if (CAMERA_CONFIG[item].id && CAMERA_CONFIG[item].id === id) { //根据指定的id拿到位置信息
      if (id == '010705') {
        site = CAMERA_CONFIG[item]
        site.lon = CAMERA_CONFIG[item].position.lon + 0.0005
        site.lat = CAMERA_CONFIG[item].position.lat - 0.0001
        site.alt = CAMERA_CONFIG[item].position.height + 50
        site.direction = CAMERA_CONFIG[item].hpr.heading
        site.pitch = CAMERA_CONFIG[item].hpr.pitch
        console.log(site.lon)
        console.log(site.lat)
        console.log(site.alt)
      } else {
        site = CAMERA_CONFIG[item]
        site.lon = CAMERA_CONFIG[item].position.lon
        site.lat = CAMERA_CONFIG[item].position.lat
        site.alt = CAMERA_CONFIG[item].position.height
        site.direction = CAMERA_CONFIG[item].hpr.heading
        site.pitch = CAMERA_CONFIG[item].hpr.pitch
      }
    }
  }
  //2.根据id实现LC隐藏显示功能
  if (id === "010307010506" || id === "010307010508") {
    checkLCModule(globalData.S3MLayer).visible = false
  } else {
    showLCModel(globalData.S3MLayer)
  }
  //3.实现定位功能
  setViewpoint(site.lon, site.lat, site.alt, site.direction, site.pitch)
}

export default {
  setViewpoint,
  addGlowPolyline,
  checkLCModule,
  setH5sVideoSource,
  projectionImage,
  addEntities,
  deleteEntities,
  removeProjection,
  showLCModel,
  removeAllProjection,
  location,
}
