import { FormEvent, useRef } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { deleteTopic, getTopic, topicKeys } from '@/api/topic'
import { CommentInput, CommentList } from '@/components'
import { useLocalStorage } from '@/hooks'
import { formatDate } from '@/lib'

export default function TopicPage() {
  const { topicId } = useParams() as { topicId: string }
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [createdTopics, setCreatedTopics] = useLocalStorage<string[]>(
    'createdTopics',
    [],
  )
  const isMyTopic = createdTopics.includes(topicId)

  const mutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: ({ deletedTopicId }) => {
      const newCreatedTopics = createdTopics.filter(
        (topicId) => topicId !== deletedTopicId,
      )
      setCreatedTopics(newCreatedTopics)
      navigate('/')
    },
  })

  function handleDeleteTopic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const password = passwordInputRef.current?.value

    if (!password) return alert('비밀번호를 입력하세요')

    mutation.mutate({ topicId, password })
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
      <section>
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
          <button>{topic.firstOption.content}</button>
          <button>{topic.secondOption.content}</button>
        </div>
      </section>
      <section>
        <h3>댓글</h3>
        <CommentInput />
        <CommentList />
      </section>
    </>
  )
}
