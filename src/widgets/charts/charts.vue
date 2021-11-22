<template>
  <div>
    <div
      id="Chart0"
      key="0"
      class="loading2"
      v-show="chartChange && !isShowPeopleFlow"
    >
      <div class="table_content">
        <div class="table_title">
          <span class="point"></span
          ><span class="title_content">{{ mainTitle }}</span>
        </div>
        <span class="icon-bg11"
        ><img src="../../assets/iconfont/时间.png" alt="" class="bg-img"
        /></span>
        <span class="icon-bg22"
        ><img src="../../assets/iconfont/人.png" alt="" class="bg-img1"
        /></span>
        <span class="icon-bg44"
        ><img src="../../assets/iconfont/人2.png" alt="" class="bg-img3"
        /></span>
        <div class="font-box2">
          <div>当前时间: {{ currentTime }}</div>
          <div>当前人数：{{ currentPersonNum }}</div>
          <div>预计人数：{{ predictPersonNum }}</div>
        </div>
      </div>

      <div class="box_title">
        <div class="box_font">
          <div class="box_font_div1">地点</div>
          <div class="box_font_div2">当前人数</div>
          <div class="box_font_div3">安保人数</div>
          <div class="box_font_div4">预计人数</div>
        </div>

        <div class="box">
          <div
            class="box_content"
            v-for="item in recParams"
            :key="item.cameraID"
          >
            <div class="box_content_font">
              <span class="box_content_span1">{{ item.title }}</span>
              <span>{{ item.info[4].persons.length }}</span>
              <span class="box_content_span3">{{ item.info[0].persons.length }}</span>
              <span>{{ parseInt(item.info[4].persons.length * (1 + 1 * Math.random())) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="myChart3" class="line_content2"></div>

      <div class="btnContainer">
        <div class="btn-close" title="关闭" @click="handleCloseStatis"></div>
      </div>
    </div>
    <div id="Chart1" key="1" class="loading1" v-show="isShowPeopleFlow">
      <div class="table_content">
        <span class="icon-bg1">
          <img src="../../assets/iconfont/时间.png" alt="" class="bg-img"/>
        </span>
        <span class="icon-bg2">
          <img src="../../assets/iconfont/人.png" alt="" class="bg-img1"/>
        </span>
        <span class="icon-bg3">
          <img src="../../assets/iconfont/警察.png" alt="" class="bg-img2"/>
        </span>
        <span class="icon-bg4">
          <img src="../../assets/iconfont/人2.png" alt="" class="bg-img3"/>
        </span>
        <div class="font-box1">
          <div>当前时间: {{ currentTime }}</div>
          <div>当前人数：{{ currentPersonNum }}</div>
          <div>安保警员：{{ securityPersonNum }}</div>
          <div>预计人数：{{ predictPersonNum }}</div>
        </div>
      </div>
      <div ref="myChart" class="line_content"></div>
      <div class="displayModel" :class="{hideDisplay: !isModel }" :title="ModelTitle" @click="handelModel">
        人模型
      </div>
      <div class="displayHeatMap" :class="{hideDisplay: !isHeatMap }" :title="HeatMapTitle" @click="handelHeatMap">
        热力图
      </div>
    </div>
  </div>
</template>
<script>
import peopleFlow from "../source-tree/peopleFlow";
import echarts from "echarts";

export default {
  name: "Charts",
  data() {
    return {
      mainTitle: "",
      timer: null,
      peoplesList: [],
      peoplesList1: [],
      xAxisData: [],
      chartTitle: "",
      moment: 0,
      isModel: true,
      isHeatMap: false,
      isShowPeopleFlow: false,
      currentCameraTopFive: {},
      ModelTitle: "关闭人模型",
      HeatMapTitle: "打开热力图",
      myChart: null,
      myChart2: null,
      chartChange: false,
      currentTime: "12:00",
      currentPersonNum: 0,
      securityPersonNum: 7,
      predictPersonNum: 0,
      recParams: {}
    };
  },
  mounted() {
    let _this = this;
    this.on("isShowPeopleFlow", isShowPeopleFlow => {
      this.chartChange = false;
      if (!isShowPeopleFlow) {
        if (this.myChart) {
          this.myChart.clear();
        }
      }
      if (this.isShowPeopleFlow != isShowPeopleFlow) {
        clearInterval(this.timer);
        this.isShowPeopleFlow = isShowPeopleFlow;
      }
    });
    this.on("closePeopleFlow", val => {
      //  console.log(val,"chartClose")
      if (this.isShowPeopleFlow != val) {
        clearInterval(this.timer);
        this.isShowPeopleFlow = val;
        if (this.myChart) {
          this.myChart.clear();
        }
      }
    });
    this.on("charts", charts => {
      _this.chartTitle = charts;
    });
    this.on("currentCameraTopFive", currentCameraTopFive => {
      _this.currentCameraTopFive = JSON.parse(JSON.stringify(currentCameraTopFive));
      peopleFlow.getHeatMapData(currentCameraTopFive);
      _this.peoplesList.length = 0;
      _this.xAxisData.length = 0;
      this.moment = _this.currentCameraTopFive.info.length - 1;
      for (let i = 0; i < _this.currentCameraTopFive.info.length; i++) {
        _this.peoplesList.push(_this.currentCameraTopFive.info[i].peopleNum);
        _this.xAxisData.push(
          _this.currentCameraTopFive.info[i].time.substr(8, 2) +
          ":" +
          _this.currentCameraTopFive.info[i].time.substr(10, 2)
        );
      }
      _this.currentTime = _this.xAxisData[_this.xAxisData.length - 1];
      _this.currentPersonNum = _this.peoplesList[_this.peoplesList.length - 1];
      _this.xAxisData.push("预测");

      _this.predictPersonNum = _this.peoplesList[_this.peoplesList.length - 1] + parseInt(Math.random() * _this.peoplesList[_this.peoplesList.length - 1]);
      _this.peoplesList.push(_this.predictPersonNum);
      let peoplesList1 = [];
      for (let i = 0; i < _this.peoplesList.length - 2; i++) {
        peoplesList1.push("-");
      }
      peoplesList1.push(_this.peoplesList[_this.peoplesList.length - 2]);
      peoplesList1.push(_this.peoplesList[_this.peoplesList.length - 1]);

      let notename = "时间 人流量";
      let PopulationMax = _this.peoplesList[0];
      for (let i = 0; i < _this.peoplesList.length - 1; i++) {
        PopulationMax =
          PopulationMax < _this.peoplesList[i + 1] ? _this.peoplesList[i + 1] : PopulationMax;
      }

      function renderCharts() {
        _this.myChart = echarts.init(_this.$refs.myChart);
        if (_this.peoplesList) {
          //折线图
          _this.myChart.setOption({
            //提示框
            tooltip: {
              textStyle: {
                fontSize: 10
              },
              axisPointer: {
                type: "line"
              },
              formatter: "{b}人数为{c}"
            },
            yAxis: {
              show: true,
              min: 0,
              max: PopulationMax + 1,
              minInterval: 1,
              axisLine: {
                show: true,
                lineStyle: {
                  width: 2,
                  color: "#37EBF8"
                }
              },
              axisLabel: {
                textStyle: {
                  color: "#37EBF8",
                  fontSize: 16
                }
              },
              axisTick: {
                show: false,
                length: 20
              },
              splitLine: {
                show: true,
                lineStyle: {
                  width: 1,
                  color: "#37EBF8",
                  type: "dashed"
                }
              }
            },
            animationDuration: 5000,
            //x轴
            xAxis: {
              type: "category",
              // data: ['01:00', '02:00', '03:00', '04:00', '05:00'],
              data: _this.xAxisData,
              name: "",
              boundaryGap: false,
              axisLine: {
                show: true,
                lineStyle: {
                  width: 2,
                  color: "#37EBF8"
                }
              },
              axisLabel: {
                textStyle: {
                  color: "#37EBF8",
                  fontSize: 16
                }
              },
              splitLine: {
                //网格线
                show: false //网格线
              },
              axisTick: {
                //刻度线
                show: false, //去掉刻度线
                length: 15,
                lineStyle: {
                  color: "#37EBF8",
                  width: 2
                }
              }
            },
            series: [
              {
                name: notename,
                type: "line",
                smooth: false, //折线是否平滑
                showSymbol: true, //显示折点
                symbol: "circle", //折点为实心点
                symbolSize: 4, //折点的大小
                areaStyle: {
                  normal: {
                    color: "rgba(55,235,248,0.5)"
                  }
                },
                itemStyle: {
                  color: "#37EBF8" //折线点的颜色
                }, //折线拐点样式
                data: _this.peoplesList
              },
              {
                name: notename,
                type: "line",
                smooth: false, //折线是否平滑
                showSymbol: true, //显示折点
                symbol: "circle", //折点为实心点
                symbolSize: 4, //折点的大小
                areaStyle: {
                  normal: {
                    color: "rgba(255,0,0,0.5)"
                  }
                },
                itemStyle: {
                  color: "red" //折线点的颜色
                }, //折线拐点样式
                data: peoplesList1
              }
            ]
          });
        }
        return;
      }

      this.timer = setInterval(renderCharts(), 5000 / 5);
      _this.myChart.on("click", function (params) {
        peopleFlow.removeHeatMap();
        _this.isHeatMap = false;
        _this.isModel = true;
        _this.moment = params.dataIndex;
        let imgSrc = "";
        if (_this.moment == "4") {
          imgSrc = "data:image/jpeg;base64," + _this.currentCameraTopFive.info[_this.moment].imageOutput;
        } else if (_this.moment == "5") {
          imgSrc = "http://192.168.2.155:8080/data/none.jpg"
        } else if (currentCameraTopFive.info[_this.moment].peopleNum > 0) {
          imgSrc = _this.historyImgUrl + _this.currentCameraTopFive.info[_this.moment].image;
        } else {
          imgSrc = _this.historyImgUrlUp + _this.currentCameraTopFive.info[_this.moment].image;
        }
        if (_this.moment < 5) {
          peopleFlow.addPeoplesByMoment(window.viewer, _this.moment, currentCameraTopFive)
        } else {
          peopleFlow.removeManModel()
        }
        _this.emit("imgsrc", imgSrc);
        _this.emit("imgsrcChange", imgSrc);
      });
    });
    this.on("isHeatMap", isHeatMap => {
      this.isHeatMap = isHeatMap;
    });
    this.on("statisfy", val => {
      _this.chartChange = true;
      if (_this.chartChange) {
        _this.predictPersonNum = 0;
        _this.peoplesList = [];
        _this.peoplesList1 = [];
        _this.xAxisData = [];
        _this.currentPersonNum = 0;
        _this.recParams = val;
        _this.currentTime = this.recParams[0].info[this.recParams[0].info.length - 1].time.slice(8, 10) + ":00";
        _this.recParams[0].info.forEach(item => {
          _this.xAxisData.push(item.time.slice(8, 10) + ":00");
        });
        _this.mainTitle = this.recParams[0].parTitle
        _this.xAxisData.push("预测");
        var sumPeoNum = [0, 0, 0, 0, 0];
        _this.recParams.forEach(element => {
          _this.currentPersonNum += element.info[4].persons.length;
          _this.predictPersonNum += parseInt(element.info[4].persons.length * (1 + 1 * Math.random()));
          _this.peoplesList1.push("-");
          sumPeoNum[0] += element.info[0].persons.length;
          sumPeoNum[1] += element.info[1].persons.length
          sumPeoNum[2] += element.info[2].persons.length
          sumPeoNum[3] += element.info[3].persons.length
          sumPeoNum[4] += element.info[4].persons.length
        });
        _this.peoplesList = sumPeoNum;
        _this.peoplesList1[4] = this.peoplesList[4];
        _this.peoplesList.push("-");
        _this.peoplesList1.push(this.predictPersonNum);
        let PopulationMax = _this.peoplesList[0];
        for (let i = 0; i < _this.peoplesList.length - 1; i++) {
          PopulationMax = PopulationMax < _this.peoplesList[i + 1] ? _this.peoplesList[i + 1] : PopulationMax;
        }
        PopulationMax = PopulationMax > _this.predictPersonNum ? PopulationMax : _this.predictPersonNum;
        var initChart = document.getElementById("myChart3");
        _this.myChart2 = echarts.init(initChart);

        function renderCharts() {
          if (_this.peoplesList) {
            //折线图
            _this.myChart2.setOption({
              //提示框
              tooltip: {
                textStyle: {
                  fontSize: 10
                },
                axisPointer: {
                  type: "line"
                },
                formatter: "{b}人数为{c}"
              },
              yAxis: {
                show: true,
                min: 0,
                max: PopulationMax + 1,
                minInterval: 1,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 2,
                    color: "#37EBF8"
                  }
                },
                axisTick: {
                  show: false,
                  length: 20
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    width: 1,
                    color: "#37EBF8",
                    type: "dashed"
                  }
                }
              },
              animationDuration: 5000,
              //x轴
              xAxis: {
                type: "category",
                // data: ['01:00', '02:00', '03:00', '04:00', '05:00'],
                data: _this.xAxisData,
                name: "",
                boundaryGap: false,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 2,
                    color: "#37EBF8"
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: "#37EBF8",
                    fontSize: 12
                  }
                },
                splitLine: {
                  //网格线
                  show: false //网格线
                },
                axisTick: {
                  //刻度线
                  show: false, //去掉刻度线
                  length: 15,
                  lineStyle: {
                    color: "#37EBF8",
                    width: 2
                  }
                }
              },
              series: [
                {
                  type: "line",
                  smooth: false, //折线是否平滑
                  showSymbol: true, //显示折点
                  symbol: "circle", //折点为实心点
                  symbolSize: 4, //折点的大小
                  areaStyle: {
                    normal: {
                      color: "rgba(55,235,248,0.5)"
                    }
                  },
                  itemStyle: {
                    color: "#37EBF8" //折线点的颜色
                  }, //折线拐点样式
                  data: _this.peoplesList
                },
                {
                  type: "line",
                  smooth: false, //折线是否平滑
                  showSymbol: true, //显示折点
                  symbol: "circle", //折点为实心点
                  symbolSize: 4, //折点的大小
                  areaStyle: {
                    normal: {
                      color: "rgba(255,0,0,0.5)"
                    }
                  },
                  itemStyle: {
                    color: "red" //折线点的颜色
                  }, //折线拐点样式
                  data: _this.peoplesList1
                }
              ]
            });
          }
          return;
        }

        setTimeout(renderCharts(), 100);
      }

    });
  },
  methods: {
    handleCloseStatis() {
      this.chartChange = false;
      this.xAxisData = [];
      this.peoplesList = [];
      this.myChart2.clear();
      this.emit("closeStatic");
      peopleFlow.removeHeatMap()
      this.$message.success("关闭统计", 1);
    },
    handelModel() {
      this.isModel = !this.isModel;
      if (this.isModel && this.moment < 5) {
        peopleFlow.addPeoplesByMoment(window.viewer, this.moment, this.currentCameraTopFive);
        this.ModelTitle = "关闭人模型";
      } else {
        // peopleFlow.removePeoples();
        peopleFlow.removeManModel();
        this.ModelTitle = "打开人模型";
      }
    },
    handelHeatMap() {
      this.isHeatMap = !this.isHeatMap;
      if (this.isHeatMap) {
        this.HeatMapTitle = "关闭热力图";
        console.log(window.heatMapMaxValues[this.moment])
        console.log(window.heatMapDatas[this.moment])
        console.log(window.heatMapBounds[this.moment])
        peopleFlow.createHeatMap("RLFY", 0, window.heatMapMaxValues[this.moment], window.heatMapDatas[this.moment], window.heatMapBounds[this.moment]);
      } else {
        this.HeatMapTitle = "打开热力图";
        peopleFlow.removeHeatMap();
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
.loading1 {
  position: relative;
  animation: lightSpeedInLeft;
  animation-duration: 1s;
  background-color: rgba(26, 49, 30, 0.5);
  padding: 15px;
  padding-top: 0;
  width: 60em;
  height: 19.29em;
  /*width: 70.8em;*/
  /*height: 19.29em;*/
  font-family: FZLanTingHei-L-GBK;
}

.loading2 {
  position: relative;
  animation: lightSpeedInLeft;
  animation-duration: 1s;
  background-color: rgba(26, 49, 30, 0.5);
  padding: 15px;
  padding-top: 0;
  width: 99em;
  height: 289px;
  font-family: FZLanTingHei-L-GBK;
}

.table_title {
  width: 370px;
  height: 45px;
  background: linear-gradient(
    to right,
    #00ffff,
    #15baba,
    rgba(26, 49, 30, 0.7),
    rgba(26, 49, 30, 0)
  );
  position: absolute;
  left: 48px;
  top: 24px;
  opacity: 0.9;
}

.point {
  width: 9px;
  height: 9px;
  background: #054044;
  border-radius: 50%;
  position: absolute;
  left: 20px;
  top: 20px;
}

.title_content {
  width: 98px;
  height: 22px;
  font-size: 24px;
  font-family: "Microsoft YaHei";
  font-weight: 400;
  color: #054044;
  line-height: 56px;
  position: absolute;
  left: 40px;
  top: -5px;
}

.icon-bg11 {
  position: absolute;
  width: 37px;
  height: 37px;
  background: #37ebf8;
  border-radius: 4px;
  left: 48px;
  top: 99px;
  opacity: 0.9;
}

.icon-bg22 {
  position: absolute;
  width: 37px;
  height: 37px;
  background: #37ebf8;
  border-radius: 4px;
  left: 48px;
  top: 164px;
  opacity: 0.9;
}

.icon-bg44 {
  position: absolute;
  width: 37px;
  height: 37px;
  background: #37ebf8;
  border-radius: 4px;
  left: 48px;
  top: 228px;
  opacity: 0.9;
}

.font-box2 {
  position: absolute;
  left: 110px;
  top: 85px;
  bottom: 31px;
  font-family: FZLanTingHei-L-GBK;
  color: #ffffff;
  font-weight: 400;
  text-shadow: 0px 1px 0px rgba(20, 20, 47, 0.25);
  font-size: 21px;
  line-height: 65px;
}

.box_title {
  width: 489px;
  height: 45px;
  background: rgba(0, 255, 255, 0.3);
  position: relative;
  left: 422px;
  top: 24px;
}

.box_font {
  width: 440px;
  height: 45px;
  font-size: 16px;
  font-family: FZLanTingHei-L-GBK;
  font-weight: 400;
  color: #ffffff;
  line-height: 50px;
  position: relative;
  display: flex;
  justify-content: space-around;
  opacity: 0.7;
}

.box_font_div1 {
  position: relative;
  left: 30px;
}

.box_font_div2 {
  position: relative;
  left: 50px;
}

.box_font_div3 {
  position: relative;
  left: 50px;
}

.box_font_div4 {
  position: relative;
  left: 50px;
}

.box {
  position: relative;
  width: 500px;
  height: 190px;
  overflow: auto;
}

.box_content {
  position: relative;
  width: 489px;
  height: 34px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 30px;
}

.box_content_font {
  width: 490px;
  height: 30px;
  font-size: 16px;
  font-family: FZLanTingHei-L-GBK;
  font-weight: 400;
  color: #ffffff;
  line-height: 30px;
  position: relative;
  left: 0px;
  top: 0px;
  display: flex;
  justify-content: space-around;
  text-align: left;
  opacity: 1;
}

.box_content_font span {
  width: 440px;
  text-align: center;
  opacity: 0.7;
}

.box_content_span1 {
  font-size: 1px;
  margin-left: 0px;
  width: 200px;
}

.box_content_span3 {
  margin-left: -25px;
}

.line_content {
  width: 38em;
  /* background-color: #ffff; */
  position: absolute;
  left: 22em;
  height: 289px;
}

.line_content2 {
  width: 35.45em;
  /* background-color: #ffff; */
  position: absolute;
  left: 65.45em;
  bottom: 0;
  height: 289px;
}

.table_content {
  position: absolute;
  width: 30em;
  /*background-color: red;*/
  left: 0px;
  height: 289px;
}

.icon-bg1 {
  width: 37px;
  height: 37px;
  display: flex;
  background: #37ebf8;
  border-radius: 4px;
  left: 57px;
  top: 28px;
  position: absolute;
  opacity: 0.8;
}

.icon-bg2 {
  width: 37px;
  height: 37px;
  display: flex;
  background: #37ebf8;
  border-radius: 4px;
  left: 57px;
  top: 93px;
  position: absolute;
  opacity: 0.8;
}

.icon-bg3 {
  width: 37px;
  height: 37px;
  display: flex;
  background: #37ebf8;
  border-radius: 4px;
  left: 57px;
  top: 158px;
  position: absolute;
  opacity: 0.8;
}

.icon-bg4 {
  width: 37px;
  height: 37px;
  display: flex;
  background: #37ebf8;
  border-radius: 4px;
  left: 57px;
  top: 223px;
  position: absolute;
  opacity: 0.8;
}

.bg-img {
  width: 23px;
  height: 23px;
  position: absolute;
  top: 7px;
  left: 7px;
}

.bg-img1 {
  width: 27px;
  height: 19px;
  position: absolute;
  top: 9px;
  left: 6px;
}

.bg-img2 {
  width: 22px;
  height: 24px;
  position: absolute;
  top: 8px;
  left: 9px;
}

.bg-img3 {
  width: 25px;
  height: 20px;
  position: absolute;
  top: 9px;
  left: 7px;
}

.font-box1 {
  position: absolute;
  left: 118px;
  top: 15px;
  bottom: 33px;
  font-family: FZLanTingHei-L-GBK;
  color: #ffffff;
  font-weight: 400;
  text-shadow: 0px 1px 0px rgba(20, 20, 47, 0.25);
  line-height: 65px;
  font-size: 21px;
}

.titleClass {
  left: 50%;
  text-align: center;
  color: #ffffff;
}

#table1 td {
  min-width: 6em;
}

#table2 td {
  min-width: 12em;
  height: 3em;
}

#table2 {
  top: 2em;
}

#table1 {
  top: 2em;
}

.tableFlowClass {
  overflow: auto;
  position: relative;
  width: 26em;
  height: 15em;
  text-align: center;
  color: #ffffff;
}

.curveClassChild0 {
  position: relative;
  width: 26em;
  height: 17em;
}

.historyPeople {
  position: absolute;
  left: 0px;
  bottom: 20px;
  width: 260px;
  height: 15px;
  text-align: center;
  font-family: "Microsoft YaHei";
  color: white;
  font-size: 15px;
}

.currentPeople {
  position: absolute;
  bottom: 20px;
  right: 34px;
  width: 110px;
  height: 15px;
  text-align: center;
  font-family: "Microsoft YaHei";
  color: white;
  font-size: 15px;
}

.displayModel {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 30px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  background-color: rgba(55, 235, 248, 0.5);
  font-family: "Microsoft YaHei";
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 30px;
  text-align: center;
}

.displayModel:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
}

.displayHeatMap {
  position: absolute;
  top: 0;
  right: 70px;
  width: 60px;
  height: 30px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  background-color: rgba(55, 235, 248, 0.5);
  font-family: "Microsoft YaHei";
  color: white;
  font-size: 15px;
  line-height: 30px;
  text-align: center;
}

.displayHeatMap:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
}

.hideDisplay {
  color: black;
}

.hideDisplay:hover {
  transform: scale(1.05, 1.05);
}

.btnContainer {
  z-index: 999;
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background-color: rgba(26, 49, 30, 1);
  height: 27px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  border-radius: 50px;
}

.btnContainer .btn-close {
  position: relative;
  right: 0px;
  z-index: 999;
  height: 27px;
  width: 27px;
  background: url(../../assets/img/close.png) no-repeat center;
  background-size: 80% 75%;
}

.btnContainer .btn-close:hover {
  background: url(../../assets/img/close-press.png) no-repeat center;
  background-size: 80% 75%;
  cursor: pointer;
}

.box::-webkit-scrollbar {
  width: 0px;
}
</style>
