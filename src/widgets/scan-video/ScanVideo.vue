<template>
  <div class="scanvideo" v-if="isShowPeopleFlow">
    <div class="btnContainer">
      <div class="btn-close" title="关闭" @click="handleClose"></div>
      <div
        class="btn-zoom"
        :class="{ 'btn-narrow': narrowClass }"
        :title="btnZoomTitle"
        @click="switchZoom"
      ></div>
    </div>
    <div class="imageContainer">
      <img :src="src" alt="1243" />
    </div>
    <div class="line" slot="scan-pic"></div>
  </div>
</template>

<script>
import peopleFlow from "../source-tree/peopleFlow";

export default {
  name: "ScanVideo",
  data() {
    return {
      src: "",
      zoomShow: false,
      zoomClass: true,
      narrowClass: false,
      btnZoomTitle: "放大",
      isShowPeopleFlow: false
    };
  },
  mounted() {
    let _this = this;
    this.on("currentCameraTopFive", camerasTopFive => {
      let currentCameraTopFive = JSON.parse(JSON.stringify(camerasTopFive));
      let imagePath = currentCameraTopFive.info[currentCameraTopFive.info.length-1].imageUpload;
      let imagePathN = currentCameraTopFive.info[currentCameraTopFive.info.length-1].imageOutput;
      _this.src = "data:image/jpeg;base64," + imagePath;
      setTimeout(function() {
        _this.src = "data:image/jpeg;base64," + imagePathN;
      }, 5000);
    });
    this.on("isShowPeopleFlow", isShowPeopleFlow => {
      if (this.isShowPeopleFlow !== isShowPeopleFlow) {
        this.isShowPeopleFlow = isShowPeopleFlow;
      }
    });
    _this.on("imgsrc", function(callback) {
      _this.src = callback;
    });

    this.on("closeZoomPicture", val => {
      this.zoomShow = val;
    });
    this.on("emitHandleClose", () => {
      // console.log('2344332')
      this.handleClose();
    });
  },
  computed: {},
  methods: {
    handleClose() {
      this.isShowPeopleFlow = false;
      this.zoomShow = !this.zoomShow;
      this.emit("closePeopleFlow", false);
      peopleFlow.removeHeatMap();
      // peopleFlow.removePeoples();
      peopleFlow.removeManModel();
    },
    switchZoom() {
      this.zoomShow = !this.zoomShow;
      this.narrowClass = !this.narrowClass;
      if (this.narrowClass) {
        this.btnZoomTitle = "缩小";
      } else {
        this.btnZoomTitle = "放大";
      }
      var paras = {
        zoomshow: this.zoomShow,
        src: this.src
      };
      this.emit("switchZoom", paras);
    }
  },
  watch: {
    zoomShow: function(newValue, oldValue) {
      if (newValue === false) {
        this.narrowClass = false;
        this.btnZoomTitle = "放大";
      }
    }
  }
};
</script>

<style scoped>
.scanvideo {
  position: relative;
  width: 34.3em!important;
  height: 19.29em!important;
}

.btnContainer {
  z-index: 9999;
  position: absolute;
  visibility: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 27px;
  background-color: rgba(98,194,195,1);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.btnContainer .btn-close {
  position: relative;
  right: 10px;
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

.btnContainer .btn-zoom {
  height: 27px;
  width: 27px;
  background: url(../../assets/img/zoom.png) no-repeat center;
  background-size: 80% 75%;
}

.btnContainer .btn-zoom:hover {
  background: url(../../assets/img/zoom-press.png) no-repeat center;
  background-size: 80% 75%;
  cursor: pointer;
}

.btnContainer .btn-narrow {
  height: 27px;
  width: 28px;
  background: url(../../assets/img/narrow.png) no-repeat center;
  background-size: 80% 75%;
  right: -1px;
}

.btnContainer .btn-narrow:hover {
  background: url(../../assets/img/narrow-press.png) no-repeat center;
  background-size: 80% 75%;
  cursor: pointer;
}

.imageContainer {
  width: 100%;
  height: 100%;
}

.imageContainer img {
  width: 100%;
  height: 100%;
}

.scanvideo:hover .btnContainer {
  visibility: visible;
}

.line {
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(55, 235, 248, 0.5), rgba(55, 235, 248, 0.5)),
  linear-gradient(90deg, #ffffff33 1px, transparent 0, transparent 19px),
  linear-gradient(#ffffff33 1px, transparent 0, transparent 19px),
  linear-gradient(transparent, #1a98ca);
  background-size: 100% 1.5%, 10% 100%, 100% 8%, 100% 100%;
  background-repeat: no-repeat, repeat, repeat, no-repeat;
  background-position: 0% 0%, 0 0, 0 0, 0 0;
  /* 初始位置 */
  clip-path: polygon(0% 0%, 100% 0%, 100% 1.5%, 0% 1.5%);
  /* 添加动画效果 */
  animation: move 5s 1 linear;
  position: absolute;
  top: 0;
}

@keyframes move {
  to {
    background-position: 0 100%, 0 0, 0 0, 0 0;
    /* 终止位置 */
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    background-color: rgba(255, 255, 255, 0);
  }
}
</style>
