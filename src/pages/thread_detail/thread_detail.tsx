import Taro, { useState } from '@tarojs/taro'
import { View, RichText, Image } from '@tarojs/components'
import { Thread } from '../../components/thread'
import { Loading } from '../../components/loading'
import { IThread } from '../../interfaces/thread'
import api from '../../utils/api'
import { timeagoInst, GlobalState, IThreadProps, prettyHTML } from '../../utils'
import { useAsyncEffect } from '../../utils/index'
import './index.css'

function ThreadDetail () {
  // const { loading, replies, topic, content } = this.state
  const [ topic ] = useState(GlobalState.thread)
  const [ loading, setLoading ] = useState(true)
  const [ replies, setReplies ] = useState<IThread[]>([])
  const [ content, setContent ] = useState('')

  useAsyncEffect(async () => {
    try {
      const id = GlobalState.thread.tid
      const [{ data }, { data: [ { content_rendered } ] } ] = await Promise.all([
        Taro.request<IThread[]>({
          url: api.getReplies({
            'topic_id': id
          })
        }),
        Taro.request<IThread[]>({
          url: api.getTopics({
            id
          })
        })
      ])
      setLoading(false)
      setReplies(data)
      setContent(prettyHTML(content_rendered))
    } catch (error) {
      Taro.showToast({
        title: '载入远程数据错误'
      })
    }
  }, [])

  const replieEl = replies.map((reply, index) => {
    const time = timeagoInst.format(reply.last_modified * 1000, 'zh')
    return (
      <View className='reply' key={reply.id}>
        <Image src={reply.member.avatar_large} className='avatar' />
        <View className='main'>
          <View className='author'>
            {reply.member.username}
          </View>
          <View className='time'>
            {time}
          </View>
          <RichText nodes={prettyHTML(reply.content_rendered)} className='content' />
          <View className='floor'>
            {index + 1} 楼
          </View>
        </View>
      </View>
    )
  })

  const contentEl = loading
    ? <Loading />
    : (
      <View>
        <View className='main-content'>
          <RichText nodes={content} />
        </View>
        <View className='replies'>
          {replieEl}
        </View>
      </View>
    )

  return (
    <View className='detail'>
      <Thread
        node={topic.node}
        title={topic.title}
        last_modified={topic.last_modified}
        replies={topic.replies}
        tid={topic.id}
        member={topic.member}
        not_navi={true}
      />
      {contentEl}
    </View>
  )
}

export default ThreadDetail
