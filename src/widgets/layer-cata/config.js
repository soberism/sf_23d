/**
 * 组件配置
 */
export default {
  // 组件的数据模型
  model: { },
  // 组件的配置
  settings: {
    // 组件的可共享数据
  },
  // 组件的可共享数据
  state: {},
  // 组件监听的事件
  on: [
    {event: 'hideLayerManage',label: '关闭图层管理',description: '触发关闭图层管理'}
  ],
  // 组件触发的事件
  emit: [
      {event: 'hideSourceTree', label: '关闭目录树', description: '点击确定'},
    {event:'isShowLayerManage',label:'图层管理',description:'图层管理'}
  ],
  // 组件的大小
  size: {w: 200, h: 200, isResize: true}
}
