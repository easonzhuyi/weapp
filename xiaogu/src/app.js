import '@tarojs/async-await'
import Taro, {Component} from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools 取消以下注释： if (process.env.NODE_ENV !==
// 'production' && process.env.TARO_ENV === 'h5')  {   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index', 'pages/user/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle: 'default'
    },
    tabBar: {
      color: '#b7b7b7',
      borderStyle: 'black',
      selectedColor: '#000000',
      backgroundColor: '#ffffff',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页'
        }, {
          pagePath: 'pages/user/index',
          text: '我的'
        }
      ]
    }
  }

  componentDidMount() {
    const interceptor = function (chain) {
      const requestParams = chain.requestParams
      const {method, data, url} = requestParams
      console.log(`http ${method || 'GET'} --> ${url} data: `, data)
      return chain
        .proceed(requestParams)
        .then(res => {
          if (res.data.status !== 'OK') 
            console.log(`http <-- ${url} result:`, res)
          Taro.showToast({
            title: res.data.message || '数据异常',
            icon: 'none',
            duration: 1000
          })
          return res
        })
        .catch(() => {
          Taro.showToast({title: '数据异常', icon: 'none', duration: 1000})
        })
    }

    Taro.addInterceptor(interceptor)
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用 请勿修改此函数
  render() {
    return (<Index />)
  }
}

Taro.render(
  <App />, document.getElementById('app'))
