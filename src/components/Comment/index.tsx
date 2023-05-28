import { FormEvent, useRef } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { commentKey, deleteComment } from '@/api/comment'
import { ReactComponent as User } from '@/assets/user-icon.svg'
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
      <CommentHeader>
        <UserName>
          <User />
          익명 {comment.index}
        </UserName>
        <DateWrapper>
          <span>{formatDate(comment.createdAt, 'absolute')}</span>
          {isMyComment && <button>삭제</button>}
        </DateWrapper>
      </CommentHeader>
      <Content>{comment.content}</Content>
      {/* <form onSubmit={handleDeleteComment}>
        <label>
          비밀번호 <input type="password" ref={passwordInputRef} />
        </label>
      </form> */}
    </>
  )
}

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #38af61;
  margin-bottom: 4px;
`
const UserName = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  svg {
    margin-right: 8px;
  }
`
const DateWrapper = styled.div`
  font-size: 12px;
  span {
    margin-right: 10px;
  }
  button {
    color: #38af61;
  }
`
const Content = styled.p`
  font-size: 12px;
  color: #7f7f7f;
  line-height: 1.5;
  word-wrap: break-word;
`
