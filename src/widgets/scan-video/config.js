/**
 * 组件配置
 */
export default {
  // 组件的数据模型
  model: {

  },
  // 组件的配置
  settings: { },
  // 组件的可共享数据
  state: {},
  // 组件监听的事件
  on: [
    {event: 'isShowPeopleFlow', label: '是否开始人流反演', description: '监听添加用户'},
    {event: 'currentCameraTopFive',label: '最近五个时刻人流量', description: '监听人流量'},
    {event: 'closeZoomPicture', label: '放大图关闭按钮事件', description: '放大图关闭按钮事件'},
    {event: 'imgsrc', label: 'imgsrc', description: 'imgsrc'},
    {event:'emitHandleClose',label:'触发关闭人流反演',description: '触发关闭人流反演'}
  ],
  // 组件触发的事件
  emit: [
    {event: 'closePeopleFlow',label: '关闭人流反演', description: '关闭人流反演模块'},
    {event: 'switchZoom',label: '放大繁衍图片', description: '放大繁衍图片'}
  ],
  // 组件的大小
  size: {w: 200, h: 200, isResize: true}
}
