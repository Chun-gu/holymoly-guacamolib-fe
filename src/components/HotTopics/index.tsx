import { useQuery } from '@tanstack/react-query'

import { getHotTopics, topicKeys } from '@/api/topic'
import { HotTopic } from '@/components'

export default function HotTopics() {
  const {
    data: hotTopics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: topicKeys.hot,
    queryFn: getHotTopics,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  if (hotTopics.length === 0) return <div>주제가 하나도 없어요.</div>

  return (
    <ul>
      {hotTopics.map((hotTopic) => (
        <li key={hotTopic.id}>
          <HotTopic topicId={hotTopic.id} />
        </li>
      ))}
    </ul>
  )
}
