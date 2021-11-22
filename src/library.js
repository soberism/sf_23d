import widgets from './widgets/index'
import project from '../package'
export default function () {
  this.$initLib({
    name: project.name,
    alias: '示例工程',
    version: project.version,
    description: project.description,
    widgets,
    resources: [
      '${sceneResouresHost}/Cesium.js',
      '${sceneResouresHost}/Widgets/widgets.css'
    ]
  });
}
