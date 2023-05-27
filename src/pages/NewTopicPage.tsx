import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { createTopic, topicKeys } from '@/api/topic'
import { useLocalStorage } from '@/hooks'
import { queryClient } from '@/main'
import { NewTopic } from '@/types'

export default function NewTopicPage() {
  const navigate = useNavigate()

  const [createdTopics, setCreatedTopics] = useLocalStorage<string[]>(
    'createdTopics',
    [],
  )

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<NewTopic>({
    mode: 'onChange',
  })

  const mutation = useMutation({
    mutationFn: createTopic,
    onSuccess: ({ createdTopicId }) => {
      setCreatedTopics([...createdTopics, createdTopicId])
      queryClient.invalidateQueries(topicKeys.new)
      navigate('/', { replace: true })
    },
  })

  const onSubmit: SubmitHandler<NewTopic> = (newTopic) => {
    mutation.mutate(newTopic)
  }

  return (
    <>
      <h1>새로운 주제 작성</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          제목:{' '}
          <input
            type="text"
            maxLength={20}
            {...register('title', {
              required: '제목을 입력해주세요.',
              maxLength: {
                value: 20,
                message: '최대 20자까지 입력 가능합니다.',
              },
            })}
          />
        </label>
        {errors.title && <p>{errors.title.message}</p>}

        <br />

        <label>
          내용:{' '}
          <input
            type="text"
            maxLength={300}
            {...register('content', {
              required: '내용을 입력해주세요.',
              maxLength: {
                value: 300,
                message: '최대 300자까지 입력 가능합니다.',
              },
            })}
          />
        </label>
        {errors.content && <p>{errors.content.message}</p>}

        <br />

        <label>
          선택지 A:{' '}
          <input
            type="text"
            maxLength={30}
            {...register('firstOption', {
              required: '선택지를 입력해주세요.',
              maxLength: {
                value: 30,
                message: '최대 30자까지 입력 가능합니다.',
              },
              validate: {
                notSame: (v) =>
                  v !== getValues('secondOption') ||
                  '다른 선택지를 입력해주세요.',
              },
            })}
          />
        </label>
        {errors.firstOption && <p>{errors.firstOption.message}</p>}

        <br />

        <label>
          선택지 B:{' '}
          <input
            type="text"
            maxLength={30}
            {...register('secondOption', {
              required: '선택지를 입력해주세요.',
              maxLength: {
                value: 30,
                message: '최대 30자까지 입력 가능합니다.',
              },
              validate: {
                notSame: (v) =>
                  v !== getValues('firstOption') ||
                  '다른 선택지를 입력해주세요.',
              },
            })}
          />
        </label>
        {errors.secondOption && <p>{errors.secondOption.message}</p>}

        <br />

        <label>
          비밀번호:{' '}
          <input
            type="password"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              maxLength: {
                value: 16,
                message: '최대 16자까지 입력 가능합니다.',
              },
            })}
          />
        </label>
        {errors.password && <p>{errors.password.message}</p>}

        <br />

        <button disabled={isSubmitting}>작성</button>
      </form>
    </>
  )
}
