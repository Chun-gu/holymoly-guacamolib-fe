import { FormEvent, useRef } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { commentKey, deleteComment } from '@/api/comment'
import { useLocalStorage } from '@/hooks'
import { formatDate } from '@/lib'
import { queryClient } from '@/main'

type Props = {
  comment: {
    id: string
    topicId: string
    index: number
    content: string
    createdAt: string
  }
}

export default function Comment({ comment }: Props) {
  const { topicId } = useParams() as { topicId: string }
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const [createdComments, setCreatedComments] = useLocalStorage<string[]>(
    'createdComments',
    [],
  )
  const isMyComment = createdComments.includes(comment.id)

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: ({ deletedCommentId }) => {
      const newCreatedComments = createdComments.filter(
        (commentId) => commentId !== deletedCommentId,
      )
      setCreatedComments(newCreatedComments)
      queryClient.invalidateQueries(commentKey.list(topicId))
    },
  })

  function handleDeleteComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const commentId = comment.id
    const password = passwordInputRef.current?.value

    if (!password) return alert('비밀번호를 입력해주세요.')
    mutation.mutate({ topicId, commentId, password })
  }

  return (
    <>
      <div>
        <span>익명{comment.index}</span>
        <span>{formatDate(comment.createdAt, 'absolute')}</span>
      </div>
      <p>{comment.content}</p>
      {isMyComment && (
        <form onSubmit={handleDeleteComment}>
          <label>
            비밀번호 <input type="password" ref={passwordInputRef} />
          </label>
          <button>삭제</button>
        </form>
      )}
    </>
  )
}
