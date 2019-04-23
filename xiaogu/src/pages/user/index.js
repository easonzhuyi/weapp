import {loginApi} from '@/utils/api'
import logoPng from '@/images/logo.png'
import Taro, {Component} from '@tarojs/taro'
import {View, Image, Button} from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // logined: Taro.getStorageSync('sk')
    }
  }

  config = {
    navigationBarTitleText: '我的'
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='pageUser'></View>
    )
  }
}
