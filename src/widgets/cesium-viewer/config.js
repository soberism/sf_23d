/**
 * 组件配置
 */
export default {
  name: 'CesiumViewer',
  alias: '三维地球组件',
  size: {w: 400, h: 300, isResizable: true},
  //组件的数据模型
  model: {},
  //组件的配置
  settings: {
    urlConfig:{
      label: '底图三维模型加载的url',
      type: Object,
      default: {},
      description: '配置需要加载的底图'
    }
  },
  //监听的事件
  on: [
    {event:'showMessage',label:'是否显示投射提示弹窗',description: '监听消息显示与否'}
  ],
  //触发的事件
  emit: [],
  state: {}
}
