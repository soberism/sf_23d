/**
 * 组件配置
 */
export default {
  // 组件的数据模型
  model: {

  },
  // 组件的配置
  settings: {
    historyImgUrl:{
      label: '历史图片的URL',
      type: String,
      default: '',
      description: '历史图片的URL'
    },
    historyImgUrlUp:{
      label: '历史图片的URL',
      type: String,
      default: '',
      description: '历史图片的URL'
    }
  },
  // 组件的可共享数据
  state: {},
  // 组件监听的事件
  on: [
    {event: 'isShowPeopleFlow', label: '是否开始人流反演', description: '监听添加用户'},
    {event: 'currentCameraTopFive',label: '最近五个时刻人流量', description: '监听人流量'},
    {event: 'closePeopleFlow',label: '关闭人流反演', description: '关闭人流反演模块'},
    {event: 'isHeatMap', label: '是否显示热力图', description: '监听热力图'},
    {event:'charts',label:'图标显示',description:'监听图标标题的显示'},
    {event:'statisfy',label:'提交统计数据',description: '监听提交数据与传递参数'}
  ],
  // 组件触发的事件
  emit: [
    {event: 'imgsrcChange',label: '换图片', description: '换图片'},
    {event: 'imgsrc',label: '替换src', description: '替换src'},
    {event: 'closeStatic',label: '清除统计', description: '清除统计'}

  ],
  // 组件的大小
  size: {w: 200, h: 200, isResize: true}
}
