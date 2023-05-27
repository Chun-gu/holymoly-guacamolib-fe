import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewComment>({
    mode: 'onChange',
  })

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: ({ createdCommentId }) => {
      setCreatedComments([...createdComments, createdCommentId])
      queryClient.invalidateQueries(commentKey.list(topicId))
    },
  })

  const onSubmit: SubmitHandler<NewComment> = (newComment) => {
    mutation.mutate({ topicId, newComment })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea
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

      <div>
        <input
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

        <button disabled={isSubmitting}>저장하기</button>
      </div>
    </form>
  )
}
