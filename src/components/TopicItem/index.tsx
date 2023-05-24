import { useQuery } from '@tanstack/react-query'

import { getTopic } from '@/api/topic'

type Props = {
  topicId: string
}

export default function TopicItem({ topicId }: Props) {
  const {
    isLoading,
    data: topic,
    isError,
  } = useQuery({
    queryKey: ['topics', topicId],
    queryFn: () => getTopic(topicId),
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  return (
    <div>
      <span>{topic.id}</span>
      <h3>{topic.title}</h3>
      <p>{topic.content}</p>
      <div>
        <button>{topic.firstOption.content}</button>
        <button>{topic.secondOption.content}</button>
      </div>
    </div>
  )
}
