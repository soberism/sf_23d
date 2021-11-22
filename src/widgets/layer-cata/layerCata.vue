<template>
  <div id="layer" title="图层管理" class='layer' @click="showLayerManage">
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        isShowLayerManage: false
      }
    },
    mounted() {
    },
    methods: {
      showLayerManage() {
        this.emit('hideSourceTree', false);
        this.on('hideLayerManage', (val) => {
          this.isShowLayerManage = false
          this.emit('isShowLayerManage', this.isShowLayerManage);
          if (this.isShowLayerManage) {
            $('#sjrh').removeClass('sjrhCurrentMenu')
            $('#layer').addClass('layerCurrentMenu')
          } else {
            $('#layer').removeClass('layerCurrentMenu');
          }
          return;
        })
        this.isShowLayerManage = !this.isShowLayerManage
        this.emit('isShowLayerManage', this.isShowLayerManage);
        if (this.isShowLayerManage) {
          $('#sjrh').removeClass('sjrhCurrentMenu')
          $('#layer').addClass('layerCurrentMenu')
        } else {
          $('#layer').removeClass('layerCurrentMenu');
        }
      }
    }
  }
</script>

<style scoped>
  .layer {
    height: 60%;
    width: 100%;
    /*line-height: 100%;*/
    background: url("../../assets/iconfont/图层.png") no-repeat;
    background-size: 80% 75%;
    background-position:center center;
  }

  .layer:hover {
    background: url("../../assets/iconfont/图层-press.png") no-repeat;
    background-size: 80% 75%;
    background-position:center center;
    cursor: pointer;
  }

  .layerCurrentMenu {
    background: url("../../assets/iconfont/图层.png") no-repeat;
    background-size: 80% 75%;
    background-position:center center;
    background-color: #16bff7;
  }

  .layerCurrentMenu:hover {
    cursor: pointer;
  }
</style>

