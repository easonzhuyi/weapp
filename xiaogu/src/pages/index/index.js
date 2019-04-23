import {loginApi, enteranceApi} from '@/utils/api'
import fetch from '@/utils/request'
import logoPng from '@/images/logo.png'
import practicePng from '@/images/enterance/practice.png'
import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image, Button} from '@tarojs/components'
import Enterance from './enterance'
import './index.scss'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logined: !!Taro.getStorageSync('token') || false
    }
  }

  config = {
    navigationStyle: 'custom',
    navigationBarTitleText: ' '
  }

  login(e) {
    const _this = this
    const loginParams = {
      success(res) {
        if (res.code) {
          // 发起网络请求 console.log(res, e.detail); console.log(e.detail.errMsg)
          // console.log(e.detail.iv) console.log(e.detail.encryptedData)
          fetch({
            url: loginApi,
            payload: {
              'code': res.code,
              'encryptedData': e.detail.encryptedData,
              'iv': e.detail.iv
            },
            method: 'POST'
          }).then((resolve) => {
            console.log('登录请求成功！', resolve)
            _this.getEnteranceConf()
            _this.setState({logined: true})
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    }
    Taro.login(loginParams)
  }

  getEnteranceConf() {
    Taro.setNavigationBarTitle({title: '小顾'})
    fetch({url: enteranceApi}).then((res) => {
      console.log(res);
      const list = res.data
      this.setState({list})
    }).catch(() => {
      this.setState({
        list: [
          {
            pathname: 'practice',
            picUrl: practicePng,
            title: '在线学习',
            desc: '随时随地巩固保险知识'
          }
        ]
      })
    })
  }

  componentWillMount() {
    const _this = this
    const {logined} = this.state
    if (logined) {
      Taro.checkSession({
        success() {
          // session_key 未过期，并且在本生命周期一直有效 Taro.setTabBarItem({index: 0, text: '首页'}) Taro
          // .showTabBar({animation: true})   .then(() => {})
          _this.setState({logined: true})
          _this.getEnteranceConf()
        },
        fail() {
          // 过期 Taro   .hideTabBar({})   .then(() => {})
          _this.setState({logined: false})
          Taro.setNavigationBarTitle({title: '登录'})
        }
      })
    } else {
      Taro.setNavigationBarTitle({title: '登录'})
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const {logined, list} = this.state
    return (
      <View className='page-index'>
        {!logined
          ? <View className='page-login'>
              <Image src={logoPng} style='width: 60px; height: 60px; margin:76px 0 36px' />
              <Button type='primary' openType='getPhoneNumber' onGetPhoneNumber={this.login}>微信登录</Button>
            </View>
          : <View className='page-main'>
            <View className='page-main__titlebar'>
              <Text>Hi，请选择您想使用的工具</Text>
            </View>
            <Enterance list={list} />
          </View>}
      </View>
    )
  }
}
