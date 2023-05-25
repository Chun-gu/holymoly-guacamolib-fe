import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { getTopic } from '@/api/topic'

export default function TopicPage() {
  const { topicId } = useParams() as { topicId: string }
  const {
    isLoading,
    data: topic,
    isError,
  } = useQuery({
    queryKey: ['topics', topicId],
    queryFn: () => getTopic(topicId),
  })

  if (isLoading) return <div>로딩 중..</div>
  if (isError) return <div>에러!</div>

  return (
    <>
      <section>
        <div>
          <span>{topic.createdAt}</span>
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
        <h3>댓글 목록</h3>
        <ul></ul>
      </section>
    </>
  )
}
