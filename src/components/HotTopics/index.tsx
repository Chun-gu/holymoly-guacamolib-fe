import { useQuery } from '@tanstack/react-query'

import { getTopics, topicKeys } from '@/api/topic'
import { TopicItem } from '@/components'

export default function HotTopics() {
  const {
    data: hotTopics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: topicKeys.hot,
    queryFn: getTopics,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  if (hotTopics.length === 0) return <div>주제가 하나도 없어요.</div>

  return (
    <ul>
      {hotTopics.map((hotTopic) => (
        <li key={hotTopic.id}>
          <TopicItem topicId={hotTopic.id} />
        </li>
      ))}
    </ul>
  )
}
