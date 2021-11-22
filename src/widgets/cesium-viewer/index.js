import config from './config'
import component from './cesiumViewer'

/**
 * 组件入口
 */
export default {
  // 组件名称（英文）
  name: 'cesium-viewer',
  // 组件名称（中文）
  alias: '初始化地图',
  // 展示到选择面板的图标（className）
  icon: 'iconfont icon-widget-global',
  // 组件
  component,
  // 配置
  config
}
