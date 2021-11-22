/**
 * 组件配置
 */
export default {
  // 组件的数据模型
  model: { },
  // 组件的配置
  settings: {
    // 组件的可共享数据
    getLayerListUrl: {
      label: '资源列表的URL',
      type: String,
      default: '',
      description: '配置资源列表的URL'
    }
  },
  // 组件的可共享数据
  state: {},
  // 组件监听的事件
  on: [
    {event:'isShowLayerManage',label:'图层管理',description:'图层管理'}
  ],
  // 组件触发的事件
  emit: [],
  // 组件的大小
  size: {w: 200, h: 200, isResize: true}
}
