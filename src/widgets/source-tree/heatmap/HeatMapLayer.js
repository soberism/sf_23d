/**
 *  CesiumHeatmap.js v0.1 | Cesium Heatmap Library
 *
 *  Works with heatmap.js v2.0.0: http://www.patrick-wied.at/static/heatmapjs/
 *
 * @revised by YangYi on 2019/03/07  1:增加height设置，2：解决h337异常 804314077@qq.com
 * @revised by YangYi on 2020/04/20  重构，修复诸多显示bug。
 * @example createHeatMap() {
        var bounds = {
          west: 121.229755,
          east: 121.231928,
          south: 31.005178,
          north: 31.006754
        };

        this.viewer.fitBounds(bounds);

        // init heatmap

        var heatMap = new GtCesium.HeatMapLayer(
          this.viewer, // your cesium viewer
          bounds, // bounds for heatmap layer
          {
            // heatmap.js options go here
            maxOpacity: 0.85,
            gradient: {
              0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"
            },
            radius: 30,
            height: 50,
            clampToGround:false
          }
        );

        var valueMin = 0;
        var valueMax = 100;

        // add data to heatmap
        setInterval(function () {
          heatMap.setData(valueMin, valueMax, createHeatPoints());
          // heatMap.show(true);
        },1000);

        function createHeatPoints() {
          //产生随机热力数据
          var heatNumbers = 500;
          var heatPoints = [];
          for (var i = 0; i < heatNumbers; i++) {
            heatPoints[i] = {
              "x": random(bounds.west * 1e6, bounds.east * 1e6) / 1e6,
              "y": random(bounds.south * 1e6, bounds.north * 1e6) / 1e6,
              "value": Math.random() * 100
            };
          }
          return heatPoints;
        }

        function random(lower, upper) {
          return Math.floor(Math.random() * (upper - lower + 1)) + lower;
        }

        setControls();
        function setControls() {
          var controls = new function () {
            this.height = 0;
          };
          var gui = new dat.GUI();
          var height = gui.add(controls, 'height', 0, 300).step(0.5);
          height.onChange(function (value) {
            heatMap && heatMap.setHeight(value);
          });
        }
        return heatMap;
    }
 */
'use strict';
import './heatMap'
import FadeMaterialProperty from './FadeMaterialProperty'


function define_CesiumHeatmap() {
  var CesiumHeatmap = {
    defaults: {
      useEntitiesIfAvailable: true, //是否使用viewer的entities
      minCanvasSize: 700,           // minimum size (in pixels) for the heatmap canvas
      maxCanvasSize: 2000,          // maximum size (in pixels) for the heatmap canvas
      radiusFactor: 60,             // 如果未给出半径，则使用数据点大小因子（高度和宽度除以此数字的较大值将产生使用的半径）
      spacingFactor: 1.5,           // 边界周围的额外空间（点半径乘以此数字得出间距）
      maxOpacity: 0.8,              // the maximum opacity used if not given in the heatmap options object
      minOpacity: 0.1,              // the minimum opacity used if not given in the heatmap options object
      blur: 0.85,                   // the blur used if not given in the heatmap options object
      gradient: {                   // the gradient used if not given in the heatmap options object
        '.3': 'blue',
        '.65': 'yellow',
        '.8': 'orange',
        '.95': 'red'
      },
      height: 0,
      clampToGround: false,  //是否贴地,
      clampToS3M: true  //是否贴s3m
    }
  };

  /*  Create a CesiumHeatmap instance
   *
   *  cesium:  the CesiumWidget or Viewer instance
   *  bb:      the WGS84 bounding box like {north, east, south, west}
   *  options: a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
   */
  CesiumHeatmap.create = function (cesium, bb, options) {
    var instance = new CHInstance(cesium, bb, options);
    return instance;
  };

  CesiumHeatmap._getContainer = function (width, height, id) {
    var c = document.createElement("div");
    if (id) {
      c.setAttribute("id", id);
    }
    c.setAttribute("style", "width: " + width + "px; height: " + height + "px; margin: 0px; display: none;");
    document.body.appendChild(c);
    return c;
  };

  CesiumHeatmap._getImageryProvider = function (instance) {
    //var n = (new Date()).getTime();
    var d = instance._heatmap.getDataURL();
    //console.log("Create data URL: " + ((new Date()).getTime() - n));

    //var n = (new Date()).getTime();
    var imgprov = new Cesium.SingleTileImageryProvider({
      url: d,
      rectangle: instance._rectangle
    });
    //console.log("Create imageryprovider: " + ((new Date()).getTime() - n));

    imgprov._tilingScheme = new Cesium.WebMercatorTilingScheme({
      rectangleSouthwestInMeters: new Cesium.Cartesian2(instance._mbounds.west, instance._mbounds.south),
      rectangleNortheastInMeters: new Cesium.Cartesian2(instance._mbounds.east, instance._mbounds.north)
    });

    return imgprov;
  };

  CesiumHeatmap._getID = function (len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < ((len) ? len : 8); i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

  var WMP = new Cesium.WebMercatorProjection();

  /*  Convert a WGS84 location into a mercator location
   *
   *  p: the WGS84 location like {x: lon, y: lat}
   */
  CesiumHeatmap.wgs84ToMercator = function (p) {
    var mp = WMP.project(Cesium.Cartographic.fromDegrees(p.x, p.y));
    return {
      x: mp.x,
      y: mp.y
    };
  };

  /*  Convert a WGS84 bounding box into a mercator bounding box
   *
   *  bb: the WGS84 bounding box like {north, east, south, west}
   */
  CesiumHeatmap.wgs84ToMercatorBB = function (bb) {
    var sw = WMP.project(Cesium.Cartographic.fromDegrees(bb.west, bb.south));
    var ne = WMP.project(Cesium.Cartographic.fromDegrees(bb.east, bb.north));
    return {
      north: ne.y,
      east: ne.x,
      south: sw.y,
      west: sw.x
    };
  };

  /*  Convert a mercator location into a WGS84 location
   *
   *  p: the mercator lcation like {x, y}
   */
  CesiumHeatmap.mercatorToWgs84 = function (p) {
    var wp = WMP.unproject(new Cesium.Cartesian3(p.x, p.y));
    return {
      x: wp.longitude,
      y: wp.latitude
    };
  };

  /*  Convert a mercator bounding box into a WGS84 bounding box
   *
   *  bb: the mercator bounding box like {north, east, south, west}
   */
  CesiumHeatmap.mercatorToWgs84BB = function (bb) {
    var sw = WMP.unproject(new Cesium.Cartesian3(bb.west, bb.south));
    var ne = WMP.unproject(new Cesium.Cartesian3(bb.east, bb.north));
    return {
      north: this.rad2deg(ne.latitude),
      east: this.rad2deg(ne.longitude),
      south: this.rad2deg(sw.latitude),
      west: this.rad2deg(sw.longitude)
    };
  };

  /*  Convert degrees into radians
   *
   *  d: the degrees to be converted to radians
   */
  CesiumHeatmap.deg2rad = function (d) {
    var r = d * (Math.PI / 180.0);
    return r;
  };

  /*  Convert radians into degrees
   *
   *  r: the radians to be converted to degrees
   */
  CesiumHeatmap.rad2deg = function (r) {
    var d = r / (Math.PI / 180.0);
    return d;
  };

  if (window.CesiumHeatmap === undefined) {
    window.CesiumHeatmap = CesiumHeatmap;
  }
  return CesiumHeatmap;
}

/**
 * @description Initiate a CesiumHeatmap instance
 * @param viewer {Cesium.Viewer}
 * @param bounds {object} {west,east,south,north} 单位度 a WGS84 bounding box
 * @param options {object} 热力图配置 a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
 * @param options.clampToGround {boolean} 是否贴地
 * @param options.height {number} 高度
 * @param options.gradient {object} 渐变色
 * @param options.maxOpacity {number}
 * @param options.minOpacity {number}
 * @param options.blur {number}
 * @param options.radius {number}
 * @constructor
 */
function CHInstance(viewer, bounds, options) {
  define_CesiumHeatmap();
  let o = options;
  if (!bounds) {
    return null;
  }
  if (!o) {
    o = {};
  }

  this._cesium = viewer;
  this._options = o;
  this._id = CesiumHeatmap._getID();

  this._options.gradient = ((this._options.gradient) ? this._options.gradient : CesiumHeatmap.defaults.gradient);
  this._options.maxOpacity = ((this._options.maxOpacity) ? this._options.maxOpacity : CesiumHeatmap.defaults.maxOpacity);
  this._options.minOpacity = ((this._options.minOpacity) ? this._options.minOpacity : CesiumHeatmap.defaults.minOpacity);

  //add by yangyi on 2018/12/6 增加一个height属性
  this._options.height = ((this._options.height) ? this._options.height : CesiumHeatmap.defaults.height);
  this._options.blur = ((this._options.blur) ? this._options.blur : CesiumHeatmap.defaults.blur);
  (this._options.clampToGround !== undefined) ? this._options.clampToGround : CesiumHeatmap.defaults.clampToGround;
  (this._options.clampToS3M !== undefined) ? this._options.clampToS3M : CesiumHeatmap.defaults.clampToS3M;

  this._mbounds = CesiumHeatmap.wgs84ToMercatorBB(bounds);
  this._setWidthAndHeight(this._mbounds);

  this._options.radius = Math.round((this._options.radius) ? this._options.radius : ((this.width > this.height) ? this.width / CesiumHeatmap.defaults.radiusFactor : this.height / CesiumHeatmap.defaults.radiusFactor));

  this._spacing = this._options.radius * CesiumHeatmap.defaults.spacingFactor;
  this._xoffset = this._mbounds.west;
  this._yoffset = this._mbounds.south;

  this.width = Math.round(this.width + this._spacing * 2);
  this.height = Math.round(this.height + this._spacing * 2);

  this._mbounds.west -= this._spacing * this._factor;
  this._mbounds.east += this._spacing * this._factor;
  this._mbounds.south -= this._spacing * this._factor;
  this._mbounds.north += this._spacing * this._factor;

  this.bounds = CesiumHeatmap.mercatorToWgs84BB(this._mbounds);

  this._rectangle = Cesium.Rectangle.fromDegrees(this.bounds.west, this.bounds.south, this.bounds.east, this.bounds.north);
  this._container = CesiumHeatmap._getContainer(this.width, this.height, this._id);
  this._options.container = this._container;
  this._heatmap = h337.create(this._options);
  this._container.children[0].setAttribute("id", this._id + "-hm");
}

/*  Convert a WGS84 location to the corresponding heatmap location
 *
 *  p: a WGS84 location like {x:lon, y:lat}
 */
CHInstance.prototype.wgs84PointToHeatmapPoint = function (p) {
  return this.mercatorPointToHeatmapPoint(CesiumHeatmap.wgs84ToMercator(p));
};

/*  Convert a mercator location to the corresponding heatmap location
 *
 *  p: a WGS84 location like {x: lon, y:lat}
 */
CHInstance.prototype.mercatorPointToHeatmapPoint = function (p) {
  var pn = {};

  pn.x = Math.round((p.x - this._xoffset) / this._factor + this._spacing);
  pn.y = Math.round((p.y - this._yoffset) / this._factor + this._spacing);
  pn.y = this.height - pn.y;

  return pn;
};

CHInstance.prototype._setWidthAndHeight = function (mbb) {
  this.width = ((mbb.east > 0 && mbb.west < 0) ? mbb.east + Math.abs(mbb.west) : Math.abs(mbb.east - mbb.west));
  this.height = ((mbb.north > 0 && mbb.south < 0) ? mbb.north + Math.abs(mbb.south) : Math.abs(mbb.north - mbb.south));
  this._factor = 1;

  if (this.width > this.height && this.width > CesiumHeatmap.defaults.maxCanvasSize) {
    this._factor = this.width / CesiumHeatmap.defaults.maxCanvasSize;

    if (this.height / this._factor < CesiumHeatmap.defaults.minCanvasSize) {
      this._factor = this.height / CesiumHeatmap.defaults.minCanvasSize;
    }
  } else if (this.height > this.width && this.height > CesiumHeatmap.defaults.maxCanvasSize) {
    this._factor = this.height / CesiumHeatmap.defaults.maxCanvasSize;

    if (this.width / this._factor < CesiumHeatmap.defaults.minCanvasSize) {
      this._factor = this.width / CesiumHeatmap.defaults.minCanvasSize;
    }
  } else if (this.width < this.height && this.width < CesiumHeatmap.defaults.minCanvasSize) {
    this._factor = this.width / CesiumHeatmap.defaults.minCanvasSize;

    if (this.height / this._factor > CesiumHeatmap.defaults.maxCanvasSize) {
      this._factor = this.height / CesiumHeatmap.defaults.maxCanvasSize;
    }
  } else if (this.height < this.width && this.height < CesiumHeatmap.defaults.minCanvasSize) {
    this._factor = this.height / CesiumHeatmap.defaults.minCanvasSize;

    if (this.width / this._factor > CesiumHeatmap.defaults.maxCanvasSize) {
      this._factor = this.width / CesiumHeatmap.defaults.maxCanvasSize;
    }
  }

  this.width = this.width / this._factor;
  this.height = this.height / this._factor;
};

/*  Set an array of heatmap locations
 *
 *  min:  the minimum allowed value for the data values
 *  max:  the maximum allowed value for the data values
 *  data: an array of data points in heatmap coordinates and values like {x, y, value}
 */
CHInstance.prototype._setData = function (min, max, data) {
  if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
    this._heatmap.setData({
      min: min,
      max: max,
      data: data
    });

    if (this._layer === undefined) {
      this._createLayer();
    }
    return true;
  }

  return false;
};

/**
 * @description Set an array of WGS84 locations
 * @param min {number} the minimum allowed value for the data values
 * @param max {number} the maximum allowed value for the data values
 * @param data {array} an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value }
 */
CHInstance.prototype.setData = function (min, max, data) {
  if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
    var convdata = [];

    for (var i = 0; i < data.length; i++) {
      var gp = data[i];

      var hp = this.wgs84PointToHeatmapPoint(gp);
      if (gp.value || gp.value === 0) {
        hp.value = gp.value;
      }

      convdata.push(hp);
    }
    return this._setData(min, max, convdata);
  }

  return false;
};

CHInstance.prototype.show = function () {
  if (this._layer) {
    this._layer.show = true;
  }
};

CHInstance.prototype.hide = function () {
  if (this._layer) {
    this._layer.show = false;
  }
};

/**
 * @author yangyi
 * @description 移除图层
 */
CHInstance.prototype.remove = function () {
  this._layer && this._cesium.entities.remove(this._layer);
};

/**
 * @author yangyi
 * @description 更新高度
 * @param height {number}
 */
CHInstance.prototype.setHeight = function (height) {
  this._options.height = height;
};

/**
 * @author yangyi
 * @description 获取当前的热力图
 * @return {string}
 * @private
 */
CHInstance.prototype._getCanvas = function () {
  return this._heatmap._renderer.canvas.toDataURL();
};

/**
 * @revised by yangyi on 2020/04/20 修改更新方式，不删除entity，只修改材料，避免更新数据的时候闪白色
 * @private
 */
CHInstance.prototype._createLayer = function () {
  // only works with a Viewer instance since the cesiumWidget
  // instance doesn't contain an entities property
  if (CesiumHeatmap.defaults.useEntitiesIfAvailable && this._cesium.entities) {
    // Work around issue with material rendering in Cesium
    // provided by https://github.com/criis

    let Cartesian2 = Cesium.Cartesian2,
      Color = Cesium.Color,
      defaultValue = Cesium.defaultValue,
      defined = Cesium.defined,
      defineProperties = Cesium.defineProperties,
      Event = Cesium.Event,
      createPropertyDescriptor = Cesium.createPropertyDescriptor,
      Property = Cesium.Property;

    let defaultRepeat = new Cartesian2(1, 1);
    let defaultTransparent = true;
    let defaultColor = Color.WHITE;
    let defaultPeriod = 1000;
    let defaultSync = true;

    // Object.defineProperties(FadeMaterialProperty.prototype, {
    //   /**
    //    * Gets a value indicating if this property is constant.  A property is considered
    //    * constant if getValue always returns the same result for the current definition.
    //    * @memberof FadeMaterialProperty.prototype
    //    *
    //    * @type {Boolean}
    //    * @readonly
    //    */
    //   isConstant: {
    //     get: function () {
    //       return Property.isConstant(this._image) && Property.isConstant(this._repeat);
    //     }
    //   },
    //   /**
    //    * Gets the event that is raised whenever the definition of this property changes.
    //    * The definition is considered to have changed if a call to getValue would return
    //    * a different result for the same time.
    //    * @memberof FadeMaterialProperty.prototype
    //    *
    //    * @type {Event}
    //    * @readonly
    //    */
    //   definitionChanged: {
    //     get: function () {
    //       return this._definitionChanged;
    //     }
    //   },
    //   /**
    //    * Gets or sets the Property specifying Image, URL, Canvas, or Video to use.
    //    * @memberof FadeMaterialProperty.prototype
    //    * @type {Property}
    //    */
    //   image: createPropertyDescriptor('image'),
    //   /**
    //    * Gets or sets the {@link Cartesian2} Property specifying the number of times the image repeats in each direction.
    //    * @memberof FadeMaterialProperty.prototype
    //    * @type {Property}
    //    * @default new Cartesian2(1, 1)
    //    */
    //   repeat: createPropertyDescriptor('repeat'),
    //   /**
    //    * Gets or sets the Color Property specifying the desired color applied to the image.
    //    * @memberof FadeMaterialProperty.prototype
    //    * @type {Property}
    //    * @default 1.0
    //    */
    //   color: createPropertyDescriptor('color'),
    //   /**
    //    * Gets or sets the Boolean Property specifying whether the image has transparency
    //    * @memberof FadeMaterialProperty.prototype
    //    * @type {Property}
    //    * @default 1.0
    //    */
    //   transparent: createPropertyDescriptor('transparent'),
    //   /**
    //    * 变化一次的周期，默认1000，单位毫秒
    //    */
    //   period: createPropertyDescriptor('period'),
    //   /**
    //    * 是否同步(貌似无效)
    //    */
    //   sync: createPropertyDescriptor('sync')
    // });

    /**
     * Gets the {@link Material} type at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    FadeMaterialProperty.prototype.getType = function (time) {
      return 'Image';
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    FadeMaterialProperty.prototype.getValue = function (time, result) {
      // dayNumber: 2458595
      // secondsOfDay: 5875.312049999991
      if (!defined(result)) {
        result = {};
      }

      result.image = Property.getValueOrUndefined(this._image, time);
      result.repeat = Property.getValueOrClonedDefault(this._repeat, time, defaultRepeat, result.repeat);
      result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
      if (Property.getValueOrDefault(this._transparent, time, defaultTransparent)) {
        result.color.alpha = Math.min(0.99, result.color.alpha);
      }
      //number无clone函数
      result.period = Property.getValueOrDefault(this._period, time, defaultPeriod, result.period);
      result.sync = Property.getValueOrDefault(this._sync, time, defaultSync, result.sync);
      let seconds = new Date().getTime();//time.secondsOfDay;

      if (!result.sync) {
        seconds = Math.abs(new Date().getTime() - this._startTime);//Math.abs(time.secondsOfDay - this._startTime.secondsOfDay);
      }
      let scale = 1;
      if (result.period > 0) {
        scale = seconds % result.period / result.period;
      }
      result.image = this._drawImage(result.color.toCssColorString(), scale);
      return result;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    FadeMaterialProperty.prototype.equals = function (other) {
      return this === other ||
        (other instanceof FadeMaterialProperty &&
          Property.equals(this._image, other._image) &&
          Property.equals(this._color, other._color) &&
          Property.equals(this._transparent, other._transparent) &&
          Property.equals(this._repeat, other._repeat) &&
          Property.equals(this._period, other._period));
    };

    Cesium['FadeMaterialProperty'] = FadeMaterialProperty;


    let material = new FadeMaterialProperty({
      image: this._getCanvas.bind(this),
    });

    if (Cesium.VERSION >= "1.21") {
      material.transparent = true;
    } else if (Cesium.VERSION >= "1.16") {
      material.alpha = 0.99;
    }

    let rect = {
      coordinates: this._rectangle,
      material: material,
      clampToGround: this._options.clampToGround,
      classificationType: Cesium.ClassificationType.S3M_TILE
    };

    if (!this._options.clampToGround && !this._options.clampToS3M) {
      rect.height = new Cesium.CallbackProperty(function () {
        return this._options.height;
      }.bind(this), false);
    }
    this.remove();
    this._layer = this._cesium.entities.add({
      show: true,
      rectangle: rect,
      clampToS3M: this._options.clampToS3M,
      classificationType: Cesium.ClassificationType.S3M_TILE
    });
  } else {
    if (this._layer) {
      this._cesium.scene.imageryLayers.remove(this._layer);
    }
    this._layer = this._cesium.scene.imageryLayers.addImageryProvider(CesiumHeatmap._getImageryProvider(this));
  }
};

export default CHInstance;
