import { FormEvent } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { createTopic, topicKeys } from '@/api/topic'
import { queryClient } from '@/main'
import { NewTopic } from '@/types'

export default function NewTopicPage() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(topicKeys.new)
      navigate('/', { replace: true })
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const newTopic = Object.fromEntries(
      formData.entries(),
    ) as unknown as NewTopic

    mutation.mutate(newTopic)
  }

  return (
    <>
      <h1>새로운 주제 작성</h1>
      <form onSubmit={handleSubmit}>
        <label>
          제목: <input name="title" type="text" />
        </label>
        <br />
        <label>
          내용: <input name="content" type="text" />
        </label>
        <br />
        <label>
          선택지 A: <input name="firstOption" type="text" />
        </label>
        <br />
        <label>
          선택지 B: <input name="secondOption" type="text" />
        </label>
        <br />
        <label>
          비밀번호: <input name="password" type="password" />
        </label>
        <br />
        <button>작성</button>
      </form>
    </>
  )
}
