<template>
  <div class="loadingContainer" v-if="isLoading">
    <a-spin class="loading" tip="正在加载数据，请稍后。。。。"/>
  </div>
</template>

<script>
  /* global Cesium */

  export default {
    name: "",
    data() {
      return {
        isLoading: false
      }
    },
    mounted() {
      this.on('isLoading', (val) => {
        this.isLoading = val
        // console.log('是否在加载', val)
      })
    },
    methods: {}
  }
</script>


<style scoped>
  .loadingContainer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  }
  .loading {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 200px;

  }
</style>
