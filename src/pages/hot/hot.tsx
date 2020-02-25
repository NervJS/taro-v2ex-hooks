import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { ThreadList } from '../../components/thread_list'
import { IThread } from '../../interfaces/thread'
import api from '../../utils/api'
import { useAsyncEffect } from '../../utils/index'

import './index.css'

function Hot () {
  const [ loading, setLoading ] = useState(true)
  const [ threads, setThreads ] = useState<IThread[]>([])

  useAsyncEffect(async () => {
    try {
      const res = await Taro.request<IThread[]>({
        url: api.getHotNodes()
      })
      setLoading(false)
      setThreads(res.data)
    } catch (error) {
      Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [])

  return (
    <View className='index'>
      <ThreadList
        threads={threads}
        loading={loading}
      />
    </View>
  )
}

export default Hot
