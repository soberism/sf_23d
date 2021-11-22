/**
 * 组件配置
 */
export default {
  // 组件的数据模型
  model: {},
  // 组件的配置
  settings: {
    // 组件的可共享数据
  },
  // 组件的可共享数据
  state: {},
  // 组件监听的事件
  on: [
    {event: 'switchZoom',label: '放大繁衍图片', description: '放大繁衍图片'},
    {event: 'imgsrcChange',label: '换图片', description: '换图片'},
    {event: 'closePeopleFlow',label: '关闭人流反演', description: '关闭人流反演模块'},
    {event: 'isShowPeopleFlow', label: '是否开始人流反演', description: '监听添加用户'},
  ],
  // 组件触发的事件
  emit: [
    {event: 'closeZoomPicture', label: '放大图关闭按钮事件', description: '放大图关闭按钮事件'}
  ],
  // 组件的大小
  size: {w: 200, h: 200, isResize: true}
}
