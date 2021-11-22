/**
 * 组件配置
 */
export default {
  // 组件的数据模型
  model: {},
  // 组件的配置
  settings: {
    // 组件的可共享数据
    getLayerListUrl: {
      label: '资源列表的URL',
      type: String,
      default: '',
      description: '配置资源列表的URL'
    },
    getCameraConfig: {
      label: '资源列表的URL',
      type: String,
      default: '',
      description: '配置资源列表的URL'
    },
    h5sconfig:{
      label:'接入h5s的设置',
      type:Object,
      default:{},
      description:'配置其中一个h5s的接入设置'
    },
    hlsSrc:{
      label:'接入hls的设置',
      type:String,
      default:'',
      description:'需要接入的hls的地址'
    },
    isVideo:{
      label:'是否显示hls接入的视频框',
      type:Boolean,
      default:false,
      description:'是否显示hls的视频框'
    },
    CAMERA_CONFIG:{
      label:'用于配置需要展示和投射的子节点属性数据',
      type:Object,
      default:{},
      description:'包括坐标、实体线的ID、自身在tree.json中的id'
    },
    setHls:{
      label:'控制HLS解析',
      type:Boolean,
      default:false,
      description:'控制HLS解析'
    },
    FLY_CONFIG:{
      label:'用于配置飞行参数',
      type:Object,
      default:{},
      description:'通过tree中的ID匹配'
    },
    rlfyUrl:{
      label: '人流反演后台的URL',
      type: String,
      default: '',
      description: '人流反演后台的URL'
    }
  },
  // 组件的可共享数据
  state: {},
  // 组件监听的事件
  on: [
    {event: 'isShowSourceTree', label: '是否显示资源目录', description: '监听添加用户'},
    {event: 'closePeopleFlow',label: '关闭人流反演', description: '关闭人流反演模块'},
    {event: 'closeStatic',label: '清除统计', description: '清除统计'}
  ],
  // 组件触发的事件
  emit: [
    {event: 'isShowPeopleFlow', label: '是否开始人流反演', description: '监听添加用户'},
    {event: 'cameraTopFive', label: '最近五个时刻人流量', description: '监听人流量'},
    {event: 'charts', label: '图标标题', description: '监听图标标题'},
    {event: 'isHeatMap', label: '是否显示热力图', description: '监听热力图'},
    {event:'showMessage',label:'是否显示提示',description: '监听消息显示与否'},
    {event:'statisfy',label:'提交统计数据',description: '监听提交数据与传递参数'},
    {event:'emitHandleClose',label:'触发关闭人流反演',description: '触发关闭人流反演'},
    {event:'isLoading',label:'触发人流反演加载',description: '触发人流反演加载'}

  ],
  // 组件的大小
  size: {w: 200, h: 200, isResize: true}
}
