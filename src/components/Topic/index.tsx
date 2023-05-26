import { useRef, FormEvent } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'

import { deleteTopic, vote, topicKeys, getTopic } from '@/api/topic'
import { useLocalStorage } from '@/hooks'
import { formatDate } from '@/lib'
import { queryClient } from '@/main'

export default function Topic() {
  const { topicId } = useParams() as { topicId: string }
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [createdTopics, setCreatedTopics] = useLocalStorage<string[]>(
    'createdTopics',
    [],
  )
  const isMyTopic = createdTopics.includes(topicId)
  const [votedTopics, setVotedTopics] = useLocalStorage<string[]>(
    'votedTopics',
    [],
  )
  const isVotedTopic = votedTopics.includes(topicId)

  const deleteMutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: ({ deletedTopicId }) => {
      const newCreatedTopics = createdTopics.filter(
        (topicId) => topicId !== deletedTopicId,
      )
      setCreatedTopics(newCreatedTopics)
      navigate('/')
    },
  })

  const voteMutation = useMutation({
    mutationFn: vote,
    onSuccess: ({ votedTopicId }) => {
      setVotedTopics([...votedTopics, votedTopicId])
      queryClient.invalidateQueries(topicKeys.topic(topicId))
    },
  })

  function handleVote(votedOption: string) {
    voteMutation.mutate({ topicId, votedOption })
  }

  function handleDeleteTopic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const password = passwordInputRef.current?.value

    if (!password) return alert('비밀번호를 입력하세요')

    deleteMutation.mutate({ topicId, password })
  }

  const {
    isLoading,
    data: topic,
    isError,
  } = useQuery({
    queryKey: topicKeys.topic(topicId),
    queryFn: () => getTopic(topicId),
  })

  if (isLoading) return <div>로딩 중..</div>
  if (isError) return <div>에러!</div>

  return (
    <>
      <div>
        <span>{formatDate(topic.createdAt, 'relative')}</span>
        {isMyTopic && (
          <form onSubmit={handleDeleteTopic}>
            <label>
              비밀번호
              <input type="password" ref={passwordInputRef} />
            </label>
            <button>삭제</button>
          </form>
        )}
        <button>공유</button>
      </div>
      <h1>Q. {topic.title}</h1>
      <p>내용: {topic.content}</p>
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
    </>
  )
}
