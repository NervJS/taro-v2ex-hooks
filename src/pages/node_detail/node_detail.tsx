import Taro, { useLayoutEffect, useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ThreadList } from '../../components/thread_list'
import { IThread } from '../../interfaces/thread'
import api from '../../utils/api'
import { useAsyncEffect } from '../../utils/index'

import './index.css'

function NodeDetail () {
  const [ loading, setLoading ] = useState(true)
  const [ threads, setThreads ] = useState<IThread[]>([])

  useLayoutEffect(() => {
    const { full_name } = this.$router.params
    Taro.setNavigationBarTitle({
      title: decodeURI(full_name)
    })
  }, [])

  useAsyncEffect(async () => {
    const { short_name } = this.$router.params
    try {
      const { data: { id } } = await Taro.request({
        url: api.getNodeInfo({
          name: short_name
        })
      })
      const res = await Taro.request<IThread[]>({
        url: api.getTopics({
          node_id: id
        })
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

// class NodeDetail extends Component<{}, IState> {
//   state = {
//     loading: true,
//     threads: []
//   }

//   componentWillMount () {
//     const { full_name } = this.$router.params
//     Taro.setNavigationBarTitle({
//       title: decodeURI(full_name)
//     })
//   }

//   async componentDidMount () {
//     const { short_name } = this.$router.params
//     try {
//       const { data: { id } } = await Taro.request({
//         url: api.getNodeInfo({
//           name: short_name
//         })
//       })
//       const res = await Taro.request<IThread[]>({
//         url: api.getTopics({
//           node_id: id
//         })
//       })
//       this.setState({
//         threads: res.data,
//         loading: false
//       })
//     } catch (error) {
//       Taro.showToast({
//         title: '载入远程数据错误'
//       })
//     }
//   }

//   render () {
//     const { loading, threads } = this.state
//     return (
//       <View className='index'>
//         <ThreadList
//           threads={threads}
//           loading={loading}
//         />
//       </View>
//     )
//   }
// }

export default NodeDetail
