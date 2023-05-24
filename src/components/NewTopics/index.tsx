import { useQuery } from '@tanstack/react-query'

import { getTopics, topicKeys } from '@/api/topic'
import { TopicItem } from '@/components'

export default function NewTopics() {
  const {
    data: newTopics,
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
      {newTopics.map((newTopic) => (
        <li key={newTopic.id}>
          <TopicItem {...newTopic} />
        </li>
      ))}
    </ul>
  )
}
