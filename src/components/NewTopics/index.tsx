import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getNewTopics, topicKeys } from '@/api/topic'
import { TopicItem } from '@/components'

export default function NewTopics() {
  const {
    data: newTopics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: topicKeys.new,
    queryFn: getNewTopics,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  if (newTopics.length === 0) return <div>주제가 하나도 없어요.</div>

  return (
    <ul>
      {newTopics.map((newTopic) => (
        <li key={newTopic.id}>
          <Link to={`/topics/${newTopic.id}`}>
            <TopicItem topicId={newTopic.id} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
