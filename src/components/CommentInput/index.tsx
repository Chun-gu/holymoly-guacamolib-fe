import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<NewComment>({
    mode: 'onChange',
  })

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: ({ createdCommentId }) => {
      setCreatedComments([...createdComments, createdCommentId])
      queryClient.invalidateQueries(commentKey.list(topicId))
      reset()
    },
  })

  const onSubmit: SubmitHandler<NewComment> = (newComment) => {
    mutation.mutate({ topicId, newComment })
  }

  return (
    <CommentForm onSubmit={handleSubmit(onSubmit)}>
      <CommentTextArea
        placeholder="댓글 추가"
        {...register('content', {
          required: '내용을 입력해주세요.',
          maxLength: {
            value: 100,
            message: '최대 100자까지 입력 가능합니다.',
          },
        })}
      />
      {errors.content && <p>{errors.content.message}</p>}

      <FlexContainer>
        <PasswordInput
          type="password"
          placeholder="비밀번호"
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            maxLength: {
              value: 16,
              message: '최대 16자까지 입력 가능합니다.',
            },
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}

        <SaveButton disabled={isSubmitting || !isValid}>저장하기</SaveButton>
      </FlexContainer>
    </CommentForm>
  )
}
const CommentForm = styled.form`
  margin-bottom: 30px;
`
const CommentTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  font-size: 14px;
  border: 1px solid #33ac5f;
  padding: 7px;
  margin-bottom: 10px;
  resize: none;
  &::placeholder {
    color: #38af61;
  }
`
const PasswordInput = styled.input`
  width: 143px;
  font-size: 12px;
  padding: 7px;
  border: 1px solid #33ac5f;
  &::placeholder {
    color: #38af61;
  }
`
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const SaveButton = styled.button`
  font-size: 14px;
  color: #38af61;
`
