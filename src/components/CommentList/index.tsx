import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import Comment from '../Comment'

import { getComments } from '@/api/comment'

export default function CommentList() {
  const { topicId } = useParams() as { topicId: string }

  const {
    isLoading,
    data: comments,
    isError,
  } = useQuery({
    queryKey: ['comments', topicId],
    queryFn: () => getComments(topicId),
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          <Comment comment={comment} />
        </li>
      ))}
    </ul>
  )
}
