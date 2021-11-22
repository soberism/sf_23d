const path = require('path')
const webpack = require('webpack')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
//
// const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  productionSourceMap: true,
  // publicPath: './',
  // lintOnSave: false,
  // 修改 src 为 examples
  // pages: {
  //   index: {
  //     entry: 'examples/main.js',
  //     template: 'public/index.html',
  //     filename: 'index.html'
  //   }
  // },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    // config.resolve.alias
    //   .set('@', path.resolve('examples'))
    //   .set('~', path.resolve('packages'))
    // lib目录是组件库最终打包好存放的地方，不需要eslint检查
    // docs是存放md文档的地方，也不需要eslint检查
    config.module
      .rule('assets')
      .test(/\.(cur)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
    config.module
      .rule('eslint')
      // .exclude.add(path.resolve('lib'))
      // .end()

      .exclude.add(path.resolve('docs'))
      .end()
    // config.module
    //   .rule('js')
    //   .include
    //   .add('/packages/')
    //   .end()
    //   .use('babel')
    //   .loader('babel-loader')
    //   .tap(options => {
    //     // 修改它的选项...
    //     return options
    //   })
  },
  configureWebpack: (config) => {
    // 判断为生产模式下，因为开发模式我们是想保存console的
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer.map((arg) => {
        const option = arg.options.terserOptions.compress
        option.drop_console = true // 打开开关
        option.drop_debugger = true // 打开开关
        return arg
      })
    }
  },
  css: {
    // css预设器配置项
    loaderOptions: {
      scss: {
        prependData: '@import "./src/common/style/mixins.scss";'
      }
    }
  },
  devServer: {
    port: 9999,
    https: false,
    hotOnly: false,
    // 设置代理 常用于跨域访问
    proxy: {
      // '/': {
      //   target: 'http://192.168.3.97:8111/',
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/old-path': '/api/new-path', // rewrite path
      //     '^/api/remove/path': '/path' // remove base path
      //   }
      // },
      '/arcgis': {
        target: 'http://192.168.2.205:6080/'
      }
    },
    before: app => {
    }
  },
  lintOnSave: false,
}
