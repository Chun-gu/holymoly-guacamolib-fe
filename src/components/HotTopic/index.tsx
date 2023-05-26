import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getTopic, topicKeys, vote } from '@/api/topic'
import { useLocalStorage } from '@/hooks'
import { queryClient } from '@/main'

type Props = {
  topicId: string
}

export default function HotTopic({ topicId }: Props) {
  const [votedTopics, setVotedTopics] = useLocalStorage<string[]>(
    'votedTopics',
    [],
  )
  const isVotedTopic = votedTopics.includes(topicId)

  const mutation = useMutation({
    mutationFn: vote,
    onSuccess: ({ votedTopicId }) => {
      setVotedTopics([...votedTopics, votedTopicId])
      queryClient.invalidateQueries(topicKeys.topic(topicId))
    },
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
      <h3>Q. {topic.title}</h3>
      <p>{topic.content}</p>
      <div>
        <button
          onClick={() => handleVote('firstOption')}
          disabled={isVotedTopic}>
          {topic.firstOption.content}/{topic.firstOption.count}
        </button>
        <button
          onClick={() => handleVote('secondOption')}
          disabled={isVotedTopic}>
          {topic.secondOption.content}/{topic.secondOption.count}
        </button>
      </div>
      {isVotedTopic && <Link to={`/topics/${topicId}`}>의견 보러 가기</Link>}
    </div>
  )
}
