import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image } from '@tarojs/components'
import url from '../resource/spiner.gif'
import './loading.css'

class Loading extends React.Component {
  render () {
    return (
      <View className='loading'>
        <Image src={url} className='img' />
        {this.props.children}
      </View>
    )
  }
}

export { Loading }
