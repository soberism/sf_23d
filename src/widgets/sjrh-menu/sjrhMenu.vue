<template>
  <div id="sjrh" title="实景融合" class='sjrh' @click="showSouceTree">
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data() {
    return {
      isShowSourceTree: false
    }
  },
  mounted() {
  },
  methods: {
    showSouceTree() {
      this.emit('hideLayerManage', false);
      this.on('hideSourceTree', (val) => {
        this.isShowSourceTree = false
        this.emit('isShowSourceTree', this.isShowSourceTree);
        if (this.isShowSourceTree) {
          $('#layer').removeClass('layerCurrentMenu')

          $('#sjrh').addClass('sjrhCurrentMenu')
        } else {
          $('#sjrh').removeClass('sjrhCurrentMenu');
        }
        return;
      })
      this.isShowSourceTree = !this.isShowSourceTree;
      this.emit('isShowSourceTree', this.isShowSourceTree);
      if (this.isShowSourceTree) {
        $('#layer').removeClass('layerCurrentMenu')
        $('#sjrh').addClass('sjrhCurrentMenu')
      } else {
        $('#sjrh').removeClass('sjrhCurrentMenu');
      }
    }
  }
}
</script>

<style scoped>
.sjrh {
  height: 60%;
  width: 100%;
  /*line-height: 100%;*/
  background: url("../../assets/iconfont/摄像头.png") no-repeat;
  background-size: 80% 75%;
  background-position:center center;
}

.sjrh:hover {
  background: url("../../assets/iconfont/摄像头-press.png") no-repeat;
  background-size: 80% 75%;
  background-position:center center;
  cursor: pointer;
}

.sjrhCurrentMenu {
  background: url("../../assets/iconfont/摄像头.png") no-repeat;
  background-size: 80% 75%;
  background-position:center center;
  background-color: #16bff7;
}

.sjrhCurrentMenu:hover {
  cursor: pointer;
}

</style>
