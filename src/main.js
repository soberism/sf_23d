import Vue from "vue";
import App from "./App.vue";
import Basis from "gt-mse-base";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import LocalLibrary from "./library";
import router from "./router";
//引入
import Antd, {Icon} from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1788022_zxwim5av6sd.js"
});

Vue.use(Antd);
Vue.component("IconFont", IconFont);

const basis = new Basis(Vue, {
  mode: "dev",
  registry: {
    "shijingronghe-widgets": LocalLibrary,
    "base-widgets": "http://192.168.2.155:8080/base-widgets"
  },
  plugins: {
    store,
    axios,
    router
  },
  logLevel: "auto",
  backend: "http://192.168.2.43:8081",
  test: {
    demo: [
      {
        i: "1",
        x: 0.1,
        y: 0.4,
        w: 0.256,
        h: 1.233,
        z: 3,
        source: {lib: "base-widgets", widget: "base-img"},
        config: {
          _widget: {
            id: "101"
          },
          imgSrc: require("./assets/logo.png")
        }
      },
      {
        i: "2",
        x: 0.2,
        y: 1,
        w: 1.8,
        h: 1,
        z: 3,
        source: {
          lib: "base-widgets",
          widget: "base-text"
        },
        config: {
          textValue: "实景融合二三维项目",
          fontSize: 25,
          color: "#fff",
          fontWeight: "bolder",
          lineHeight: 3
        }
      },
      {
        i: "3",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
        z: 2,
        source: {
          lib: "base-widgets",
          widget: "base-img"
        },
        config: {
          imgSrc: require("./assets/logo-bg.png"),
          imgRepeat: "noRepeat"
        }
      },
      {
        i: "4",
        x: 0,
        y: 2,
        w: 0.5,
        h: 29.22,
        z: 3,
        source: {
          lib: "base-widgets",
          widget: "base-menu"
        },
        config: {
          _widget: {
            id: "401",
            state: {},
            on: {}
          }
        }
      },
      {
        i: "5",
        x: 0,
        y: 2,
        w: 12,
        h: 29.22,
        z: 2,
        source: {
          lib: "shijingronghe-widgets",
          widget: "cesium-viewer"
        },
        config: {
          _widget: {
            id: "501",
            emit: {},
            on: {
              showMessage: "showMessage"
            }
          },
          urlConfig: {
            MAP_YX: "http://192.168.2.155:8090/iserver/services/map-Lianchuang/rest/maps/LianchuangYX_1%40Lianchuang",
            MAP_NJYX: "http://192.168.2.155:8090/iserver/services/map-njyx/rest/maps/gulou_jianye%40njyx",
            MODEL_LIANCHUANG: "http://192.168.2.155:8090/iserver/services/3D-Lianchuang/rest/realspace/datas/yuanqu/config",
            MODEL_13FLOOR: "http://192.168.2.155:8090/iserver/services/3D-Lianchuang829/rest/realspace/datas/Louceng@Lianchuang/config",
            MODEL_JN: "http://192.168.2.155:8090/iserver/services/3D-jnghcjhc/rest/realspace/datas/config/config",
            MAP_JZX_DOM: "http://192.168.2.155:8090/iserver/services/3D-jiangxinzhou-2/rest/realspace/datas/jiangxinzhouDOM@jiangxinzhou",
            MAP_JZX_DEM: "http://192.168.2.155:8090/iserver/services/3D-jiangxinzhou-2/rest/realspace/datas/jiangxinzhouDEM@jiangxinzhou",
            MAP_JZX: "http://192.168.2.155:8090/iserver/services/3D-jbxq/rest/realspace/datas/Config/config"
          }
        }
      },
      {
        i: "6",
        x: 0,
        y: 2.5,
        w: 0.3,
        h: 2,
        z: 10,
        source: {
          lib: "shijingronghe-widgets",
          widget: "sjrh-menu"
        },
        config: {
          _widget: {
            id: "601",
            emit: {
              isShowSourceTree: "isShowSourceTree",
              hideLayerManage: "hideLayerManage"
            },
            on: {
              hideSourceTree: "hideSourceTree"
            }
          }
        }
      },
      {
        i: "7",
        x: 0.3,
        y: 2,
        w: 3,
        h: 29.22,
        z: 99,
        source: {
          lib: "shijingronghe-widgets",
          widget: "source-tree"
        },
        config: {
          _widget: {
            id: "601",
            on: {
              isShowSourceTree: "isShowSourceTree",
              closePeopleFlow: "closePeopleFlow",
              closeStatic: "closeStatic"
            },
            emit: {
              isShowPeopleFlow: "isShowPeopleFlow",
              currentCameraTopFive: "currentCameraTopFive",
              charts: "charts",
              isHeatMap: "isHeatMap",
              showMessage: "showMessage",
              statisfy: "jaklsdj123",
              emitHandleClose: "emitHandleClose",
              isLoading: "isLoading"
            }
          },
          getLayerListUrl: "../../test.json",
          getCameraConfig: "../../cameraConfig.json",
          h5sconfig: {
            videoid: "010307010508", //拿到video的id
            protocol: "http:",
            host: "192.168.50.126:8081",
            rootpath: "/",
            token: "token1",
            hlsver: "v1",
            session: "c1782caf-b670-42d8-ba90-2244d0b0ee83"
          },
          hlsSrc: "http://play2.allcam.com.cn/live/push_32000000000105010103000000004281.m3u8",
          isVideo: false,
          CAMERA_CONFIG: {
            INIT: {
              hpr: {
                heading: 359.65373662715,
                pitch: -87.84516047412012,
                roll: 0
              },
              position: {
                lon: 118.80178116097503,
                lat: 31.916706367817653,
                height: 11824.107263787746
              }
            },
            // 联创大厦位置
            Lianchuang: {
              hpr: {heading: 359.65185354794795, pitch: -90, roll: 0},
              position: {
                lon: 118.716028877783,
                lat: 32.0361166006776,
                height: 400
              },
              id: "0103070105"
            },
            Jiangning: {
              hpr: {
                heading: 359.6614319580618,
                pitch: -87.83472013250872,
                roll: 0
              },
              position: {
                lon: 118.81633298606242,
                lat: 31.927384119268712,
                height: 1505.530431621343
              },
              id: "0107"
            },
            Jiangpu: {
              hpr: {
                heading: 200,
                pitch: -87.83472013250872,
                roll: 0
              },
              position: {
                lon: 118.65664199,
                lat: 32.07512430,
                height: 10000
              },
              id: "0105"
            },
            LianchuangRukou: {
              hpr: {
                heading: 28.245728,
                pitch: -9.807173,
                roll: 0,
                horizontalFOV: 36,
                verticalFOV: 23
              },
              position: {lon: 118.7156728, lat: 32.0357101, height: 3.725},
              id: "010307010501",
              lineID: "发光线01",
              cameraSrc: "http://192.168.2.155:8080/video/01-联创入口.mp4"
            },
            Tingchechang: {
              hpr: {
                heading: 211.6,
                pitch: -19.539254,
                roll: 0,
                horizontalFOV: 55,
                verticalFOV: 36.8
              },
              position: {lon: 118.7166228, lat: 32.0365036, height: 3.725},
              id: "010307010502",
              lineID: "发光线02",
              cameraSrc: "http://192.168.2.155:8080/video/02-停车场.mp4"
            },
            TingchechanFuyiceng: {
              hpr: {
                heading: 311.845116,
                pitch: -12.649185,
                roll: 28,
                horizontalFOV: 42.9,
                verticalFOV: 28
              },
              position: {lon: 118.71666, lat: 32.0364225, height: 3.725},
              id: "010307010503",
              lineID: "发光线03",
              cameraSrc:
                "http://192.168.50.126:8080/video/03-停车场（负一层入口）.mp4"
            },
            LianchuangRuhudating: {
              hpr: {
                heading: 41.855182,
                pitch: -11.032771,
                roll: 0,
                horizontalFOV: 37,
                verticalFOV: 27
              },
              position: {lon: 118.715797, lat: 32.0361144, height: 5.132},
              id: "010307010504",
              lineID: "发光线04",
              cameraSrc:
                "http://192.168.50.126:8080/video/04-联创大厦-入户大厅.mp4"
            },
            Guangchang: {
              hpr: {
                heading: 293.2,
                pitch: -7.4,
                roll: 0,
                horizontalFOV: 39.5,
                verticalFOV: 22
              },
              position: {lon: 118.7165368, lat: 32.0360215, height: 3.725},
              id: "010307010505",
              lineID: "发光线05",
              cameraSrc: "http://192.168.50.126:8080/video/05-广场.mp4"
            },
            Shineibangongqu: {
              hpr: {
                heading: 315,
                pitch: -21.6,
                roll: 25.9,
                horizontalFOV: 52.5,
                verticalFOV: 31.9
              },
              position: {lon: 118.7158269, lat: 32.0367335, height: 50.0},
              id: "010307010506",
              lineID: "发光线06",
              cameraSrc: "http://192.168.50.126:8080/video/06-室内办公区.mp4"
            },
            LianchuangA12: {
              hpr: {
                heading: 118.45,
                pitch: -37,
                roll: 26.6,
                horizontalFOV: 47.2,
                verticalFOV: 26.6
              },
              position: {lon: 118.71599, lat: 32.03658, height: 45.52},
              id: "010307010507",
              lineID: "发光线07",
              cameraSrc:
                "http://192.168.50.126:8080/video/07-联创A栋12楼位置.mp4"
            },
            Zhihuidilibangongshi: {
              hpr: {
                heading: 296.547,
                pitch: -15.806,
                roll: 0,
                horizontalFOV: 54,
                verticalFOV: 37
              },
              position: {lon: 118.71583253, lat: 32.036443298, height: 49.93},
              id: "010307010508",
              lineID: "发光线08",
              cameraSrc:
                "http://192.168.50.126:8080/video/08-智慧地理研究室办公区.mp4"
            },
            Jiangpunanmen: {
              hpr: {
                heading: 246.585072,
                pitch: -10.782923,
                roll: 0,
                horizontalFOV: 52,
                verticalFOV: 31
              },
              position: {lon: 118.64776309, lat: 32.05380093, height: 44.215},
              id: "010501",
              lineID: "发光线09",
              cameraSrc:
                ""
            },
            Jinyingyujingfengjiaojielukou: {
              hpr: {
                heading: 92.45,
                pitch: -3.782764,
                roll: 0,
                horizontalFOV: 21.1,
                verticalFOV: 12
              },
              position: {lon: 118.814149, lat: 31.933065, height: 15.262},
              id: "010701",
              lineID: "发光线10",
              cameraSrc:
                "http://192.168.50.126:8080/video/09JnTest.mp4"
            },
            Jingfengnanguangchang: {
              hpr: {
                heading: 74,
                pitch: -14.778038,
                roll: 0,
                horizontalFOV: 40,
                verticalFOV: 20
              },
              position: {
                lon: 118.815264976892,
                lat: 31.9306218469678,
                height: 12.1014447840303
              },
              id: "010702",
              lineID: "发光线11",
              cameraSrc: "http://192.168.50.126:8080/video/10JnTest.mp4"
            },
            Jingfengxicexiaoguangchang: {
              hpr: {
                heading: 340.711696,
                pitch: -4.091084,
                roll: 0,
                horizontalFOV: 40,
                verticalFOV: 25
              },
              position: {
                lon: 118.813924900005,
                lat: 31.9312602999974,
                height: 10.47
              },
              id: "010703",
              lineID: "发光线12",
              cameraSrc:
                "http://192.168.50.126:8080/video/11JnTest.mp4"
            },
            Shuanglongdadaojingfenglukou: {
              hpr: {
                heading: 91.780621,
                pitch: -11.670227,
                roll: 0,
                horizontalFOV: 55.4,
                verticalFOV: 30
              },
              position: {
                lon: 118.81554772035,
                lat: 31.932958146618,
                height: 12.7187237991765
              },
              id: "010704",
              lineID: "发光线13",
              cameraSrc:
                "http://192.168.50.126:8080/video/12JnTest.mp4"
            },
            Taiyangchenggaokong: {
              hpr: {
                heading: 291,
                pitch: -34.8,
                roll: 0,
                horizontalFOV: 39,
                verticalFOV: 19
              },
              position: {lon: 118.817761, lat: 31.929664, height: 108.125},
              id: "010705",
              lineID: "发光线14",
              cameraSrc: "http://192.168.50.126:8080/video/13JnTest.mp4"
            },
            Jiangpunanmenyiqi: {
              hpr: {
                heading: 203.498013,
                pitch: -13.223301,
                roll: 0,
                horizontalFOV: 64,
                verticalFOV: 19
              },
              position: {lon: 118.65664199, lat: 32.07512430, height: 27.025},
              id: "010502",
              lineID: "发光线15",
              cameraSrc: ""
            },
            Pukoudisizhongxue: {
              hpr: {
                heading: 34.3,
                pitch: -54.197615,
                roll: 0,
                horizontalFOV: 71.6,
                verticalFOV: 47
              },
              position: {lon: 118.640037, lat: 32.067306, height: 46.739},
              id: "010503",
              lineID: "发光线16",
              cameraSrc: "http://192.168.2.155:8080/video/02JpTest.mp4"
            }
          },
          FLY_CONFIG: {
            Jiangpunanmensanqi: {
              id: "010501",
              title: "江浦南门三期",
              hpr: {
                heading: 246.505072,
                pitch: -50.082923,
                roll: 0
              },
              position: {lon: 118.64905309, lat: 32.05390093, height: 200.215}
            },
            Jiangpunanmenyiqi: {
              id: "010502",
              title: "江浦南门一期",
              hpr: {
                heading: 203.498013,
                pitch: -52.223301,
                roll: 0
              },
              position: {lon: 118.65854199, lat: 32.07852430, height: 500.025}
            },
            Pukouqudisizhongxue: {
              id: "010503",
              title: "浦口区第四中学",
              hpr: {
                heading: 214.045785,
                pitch: -103.087021,
                roll: 0
              },
              position: {lon: 118.64003661111111, lat: 32.067505861111116, height: 200.739}
            }
          },
          setHls: false,
          rlfyUrl:"http://192.168.2.155:5000/"
        }
      },
      {
        i: "8",
        x: 9.5,
        y: 2,
        w: 2.5,
        h: 5,
        z: 3,
        source: {
          lib: "shijingronghe-widgets",
          widget: "scan-video"
        },
        config: {
          _widget: {
            id: "801",
            on: {
              isShowPeopleFlow: "isShowPeopleFlow",
              currentCameraTopFive: "currentCameraTopFive",
              closeZoomPicture: "closeZoomPicture",
              imgsrc: "imgsrc",
              emitHandleClose: "emitHandleClose"
            },
            emit: {
              closePeopleFlow: "closePeopleFlow",
              switchZoom: "switchZoom"
            }
          }
        }
      },
      {
        i: "9",
        x: 3.3,
        y: 2,
        w: 0,
        h: 0,
        z: 4,
        source: {
          lib: "shijingronghe-widgets",
          widget: "charts"
        },
        config: {
          _widget: {
            id: "801",
            emit: {
              imgsrcChange: "imgsrcChange",
              imgsrc: "imgsrc",
              closeStatic: "closeStatic"
            },
            on: {
              isShowPeopleFlow: "isShowPeopleFlow",
              currentCameraTopFive: "currentCameraTopFive",
              closePeopleFlow: "closePeopleFlow",
              isHeatMap: "isHeatMap",
              charts: "charts",
              statisfy: "jaklsdj123"
            }
          },
          historyImgUrl:"http://192.168.50.104:9090/imgs/resImg/",
          historyImgUrlUp:"http://192.168.50.104:9090/Imgs/outputImg/"
        }
      },
      {
        i: "10",
        x: 4,
        y: 12,
        w: 4,
        h: 4,
        z: 4,
        source: {
          lib: "shijingronghe-widgets",
          widget: "zoom-picture"
        },
        config: {
          _widget: {
            id: "901",
            on: {
              switchZoom: "switchZoom",
              imgsrcChange: "imgsrcChange",
              closePeopleFlow: "closePeopleFlow",
              isShowPeopleFlow: "isShowPeopleFlow"
            },
            emit: {
              closeZoomPicture: "closeZoomPicture"
            }
          }
        }
      },
      {
        i: "11",
        x: 0,
        y: 4.5,
        w: 0.3,
        h: 2,
        z: 3,
        source: {
          lib: "shijingronghe-widgets",
          widget: "layer-cata"
        },
        config: {
          _widget: {
            id: "601",
            emit: {
              hideSourceTree: "hideSourceTree",
              isShowLayerManage: "isShowLayerManage"
            },
            on: {
              hideLayerManage: "hideLayerManage"
            }
          }
        }
      },
      {
        i: "12",
        x: 0.3,
        y: 2,
        w: 3,
        h: 29.22,
        z: 3,
        source: {
          lib: "shijingronghe-widgets",
          widget: "layer-ctrl"
        },
        config: {
          _widget: {
            id: "1201",
            on: {
              isShowLayerManage: "isShowLayerManage"
            },
            emit: {}
          },
          getLayerListUrl: "../../layers.json",
        }
      },
      {
        i: "13",
        x: 9,
        y: 3,
        w: 0,
        h: 0,
        z: 2,
        source: {
          lib: "shijingronghe-widgets",
          widget: "tool-box"
        },
        config: {
          _widget: {
            id: "1301",
            emit: {},
            on: {}
          }
        }
      },
      {
        i: "14",
        x: 0,
        y: 2,
        w: 12,
        h: 29.22,
        z: 1,
        source: {
          lib: "shijingronghe-widgets",
          widget: "peopleFlow-loading"
        },
        config: {
          _widget: {
            id: "1401",
            emit: {},
            on: {
              isLoading: "isLoading"
            }
          }
        }
      }
    ]
  }
});
basis.eventBus.on("page-been-created", () => {
  const vm = new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount("#app");
  vm.$loadLibs();
});
basis.start();
