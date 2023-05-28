import { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
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
    createAt: string
  }
}

export default function Comment({ comment }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { topicId } = useParams() as { topicId: string }
  const [createdComments, setCreatedComments] = useLocalStorage<string[]>(
    'createdComments',
    [],
  )
  const isMyComment = createdComments.includes(comment.id)

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: ({ deletedCommentId }) => {
      const newCreatedComments = createdComments.filter(
        (commentId) => commentId !== deletedCommentId,
      )
      setCreatedComments(newCreatedComments)
      queryClient.invalidateQueries(commentKey.list(topicId))
    },
    onError: () => {
      setError('password', { type: 'confirm' })
    },
  })

  function toggleDeleteTopic() {
    setIsDeleteModalOpen((prev) => !prev)
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, isValid, errors },
  } = useForm<{ password: string }>({
    mode: 'onChange',
  })
  const canSubmit = isValid && !isSubmitting
  const commentId = comment.id
  const onSubmit: SubmitHandler<{ password: string }> = ({ password }) => {
    deleteMutation.mutate({ topicId, commentId, password })
  }

  useEffect(() => {
    if (isDeleteModalOpen) {
      document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`
    }
    return () => {
      const scrollY = document.body.style.top
      document.body.style.cssText = ''
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
    }
  }, [isDeleteModalOpen])

  return (
    <>
      <CommentHeader>
        <UserName>
          <User />
          익명 {comment.index}
        </UserName>
        <DateWrapper>
          <span>{formatDate(comment.createAt, 'absolute')}</span>
          {isMyComment && <button onClick={toggleDeleteTopic}>삭제</button>}
        </DateWrapper>
      </CommentHeader>
      <Content>{comment.content}</Content>
      {isDeleteModalOpen && (
        <Overlay>
          <ModalContainer>
            <p>
              댓글을 <Delete>삭제</Delete>하시겠습니까?
            </p>
            <p>삭제하시려면 비밀번호를 입력해주세요</p>
            {errors.password?.type === 'confirm' && (
              <ErrorMessage>비밀번호가 틀렸어요.</ErrorMessage>
            )}
            <form id="passwordConfirmForm" onSubmit={handleSubmit(onSubmit)}>
              <DeleteLabel htmlFor="password">비밀번호</DeleteLabel>
              <DeleteInput
                id="password"
                type="password"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                })}
              />
            </form>
            <div>
              <CancelButton onClick={toggleDeleteTopic}>취소</CancelButton>
              <DeleteButton form="passwordConfirmForm" disabled={!canSubmit}>
                삭제
              </DeleteButton>
            </div>
          </ModalContainer>
        </Overlay>
      )}
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
const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
`
const ModalContainer = styled.div`
  width: 300px;
  border-radius: 14px;
  color: #7f7f7f;
  background-color: #ffffff;
  padding: 20px;
  text-align: center;
  line-height: 1.5;
`
const DeleteLabel = styled.label`
  margin-right: 10px;
`
const DeleteInput = styled.input`
  height: 38px;
  border: none;
  background-color: #f3f3f3;
  margin: 10px 0 20px;
  padding: 0 10px;
`
const Delete = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #38af61;
`
const CancelButton = styled.button`
  width: 124px;
  height: 37px;
  font-size: 16px;
  color: #7f7f7f;
  border-radius: 50px;
  background-color: #f3f3f3;
  margin-right: 10px;
`
const DeleteButton = styled.button`
  width: 124px;
  height: 37px;
  font-size: 16px;
  color: #ffffff;
  border-radius: 50px;
  background-color: #38af61;
`
const ErrorMessage = styled.p`
  color: #fa773c;
`
