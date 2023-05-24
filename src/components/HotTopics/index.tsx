import { useQuery } from '@tanstack/react-query'

import { getTopics, topicKeys } from '@/api/topic'
import { TopicItem } from '@/components'

export default function HotTopics() {
  const {
    data: hotTopics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: topicKeys.all,
    queryFn: getTopics,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  return (
    <ul>
      {hotTopics.map((hotTopic) => (
        <li key={hotTopic.id}>
          <TopicItem {...hotTopic} />
        </li>
      ))}
    </ul>
  )
}
