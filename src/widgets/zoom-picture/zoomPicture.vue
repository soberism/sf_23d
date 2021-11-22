<template>
  <div class="imageContainer" id="imageContainer" v-mousedrag v-if="isShow">
    <div class="btn-container">
      <div class="btn-close" title="关闭" @click="close"></div>
    </div>
    <img class="imageSize" v-bind:src="src" alt="1243">
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      src: ''
    }
  },
  directives: {
    mousedrag: {
      // 指令的定义
      bind: function (el) {
        let box = el;//获取元素
        let x, y;//存储div的坐标
        let isDrop = false;//移动状态的判断鼠标按下才能移动
        box.onmousedown = function (e) {
          e.preventDefault();
          x = e.clientX - box.offsetLeft;
          y = e.clientY - box.offsetTop;
          isDrop = true;//设为true表示可以移动
        }
        document.onmousemove = function (e) {
          e.preventDefault();
          //是否为可移动状态
          if (isDrop) {
            let moveX = e.clientX - x;//得到距离左边移动距离
            let moveY = e.clientY - y;//得到距离上边移动距离
            box.style.left = moveX + "px";
            box.style.top = moveY + "px";
          } else {
            return;
          }

        }
        document.onmouseup = function () {
          isDrop = false;//设置为false不可移动
        }
      }
    }
  },
  mounted() {
    this.on('closePeopleFlow', (val) => {
      this.close()
    })
    this.on('imgsrcChange', (val) => {
      this.src = val;
    });

    this.on('isShowPeopleFlow', (val) => {
      if (val == false) {
        this.close()
      }
    });
    this.on('switchZoom', (val) => {
      //console.log(val)
      if (this.isShow != val.zoomshow) {
        this.isShow = val.zoomshow;
        this.src = val.src;
      }
    });
  },
  watch: {},
  methods: {
    close() {
      this.isShow = false
      this.emit('closeZoomPicture', false);
    }
  },
}
</script>

<style scoped>
.imageContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 200px;
  height: 100px;
  z-index: 99999;
}

.btn-container {
  position: absolute;
  top: 0;
  width: 960px;
  height: 31px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.imageSize {
  width: 960px;
  height: 500px;
}

.imageContainer:hover {
  cursor: move;
}

.imageContainer:hover .btn-container {
  background-color: rgb(28, 85, 178);
}

.imageContainer:hover .btn-close {
  position: absolute;
  top: 0px;
  right: 10px;
  z-index: 999;
  height: 27px;
  width: 27px;
  background: url(../../assets/images/ScanVideo/close.png) no-repeat center;
  background-size: 80% 75%;
}

.btn-close:hover {
  background: url(../../assets/images/ScanVideo/close-press.png) no-repeat center;
  background-size: 80% 75%;
  cursor: pointer;
}

</style>
