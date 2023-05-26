import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getTopic, topicKeys, vote } from '@/api/topic'
import { queryClient } from '@/main'

type Props = {
  topicId: string
}

export default function TopicItem({ topicId }: Props) {
  const mutation = useMutation({
    mutationFn: vote,
    onSuccess: () => queryClient.invalidateQueries(topicKeys.topic(topicId)),
  })

  function handleVote(votedOption: string) {
    mutation.mutate({ topicId, votedOption })
  }

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
        <button onClick={() => handleVote('firstOption')}>
          {topic.firstOption.content}/{topic.firstOption.count}
        </button>
        <button onClick={() => handleVote('secondOption')}>
          {topic.secondOption.content}/{topic.secondOption.count}
        </button>
      </div>
      <Link to={`/topics/${topicId}`}>참전하러 가즈아!</Link>
    </div>
  )
}
