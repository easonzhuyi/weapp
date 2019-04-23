import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import arrowPng from '@/images/enterance/arrow.png'
import './index.scss'

export default class Enterance extends Component {
  static defaultProps = {
    list: []
  }

  handleClick = (pathname) => {
    Taro.navigateTo({url: `/pages/func/${pathname}`})
  }

  render() {
    const {list} = this.props
    console.log(list, 'list11')
    return (
      <View className='home-enterance'>
        <View className='home-enterance__list'>
          {list
          // .filter(item => item.type === 1)
            .map((item) => {
            const {id, pathname, title, desc, picUrl} = item
            return (
              <View
                key={id}
                className='home-enterance__list-item'
                onClick={this
                .handleClick
                .bind(this, pathname)}
              >
                <View className='home-enterance__list-item-title'>
                  <Text numberOfLines={1}>
                    {title}
                  </Text>
                </View>
                <View className='home-enterance__list-item-desc'>
                  <Text numberOfLines={1}>
                    {desc}
                  </Text>
                </View>
                <Image
                  className='home-enterance__list-item-image'
                  src={picUrl}
                  style='width: 150px; height: 75px' 
                />
                <Image className='home-enterance__list-item-arrow' src={arrowPng} />
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
