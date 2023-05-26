import { FormEvent } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { commentKey, createComment } from '@/api/comment'
import { useLocalStorage } from '@/hooks'
import { queryClient } from '@/main'

type NewComment = {
  content: string
  password: string
}

export default function CommentInput() {
  const { topicId } = useParams() as { topicId: string }
  const [createdComments, setCreatedComments] = useLocalStorage<string[]>(
    'createdComments',
    [],
  )

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: ({ createdCommentId }) => {
      setCreatedComments([...createdComments, createdCommentId])
      queryClient.invalidateQueries(commentKey.list(topicId))
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const newComment = Object.fromEntries(formData.entries()) as NewComment
    mutation.mutate({ topicId, newComment })
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="content" placeholder="댓글 추가" />
      <div>
        <input type="password" name="password" placeholder="비밀번호" />
        <button>저장하기</button>
      </div>
    </form>
  )
}
