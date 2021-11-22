<template>
  <div>
    <router-view/>
  </div>
</template>

<script>


  export default {
    name: 'App'
  }
</script>

<style>
  @import "~gt-mse-base/lib/gt-mse-base.css";
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: rgba(249, 249, 249, 0.98);
  }

  /*定义滚动条轨道 内阴影+圆角*/

  ::-webkit-scrollbar-track {
    width: 10px;
    box-shadow: inset 0 0 6px rgba(248, 255, 111, 0);
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0);
  }

  /*定义滑块 内阴影+圆角*/

  ::-webkit-scrollbar-thumb {
    z-index: 100;
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(246, 246, 246, 0.76);
    background-color: rgb(210, 212, 214);
  }
  body{
    margin:0
  }
</style>
