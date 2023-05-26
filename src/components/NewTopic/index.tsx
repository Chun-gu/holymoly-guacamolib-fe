import { useQuery } from '@tanstack/react-query'

import { getTopic, topicKeys } from '@/api/topic'

type Props = {
  topicId: string
}

export default function NewTopic({ topicId }: Props) {
  const {
    isLoading,
    data: topic,
    isError,
  } = useQuery({
    queryKey: topicKeys.topic(topicId),
    queryFn: () => getTopic(topicId),
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  return (
    <>
      <h3>Q. {topic.title}</h3>
      <div>
        <div>{topic.commentCount}</div>
        <div>{topic.voteCount}</div>
      </div>
    </>
  )
}
