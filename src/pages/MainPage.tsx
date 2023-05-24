import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { createTopic, topicKeys } from '@/api/topic'
import { HotTopics, NewTopics } from '@/components'
import { queryClient } from '@/main'

export default function MainPage() {
  const newTopic = {
    title: '물복 vs 딱복',
    content: '물복이 좋냐 딱복이 좋냐',
    firstOption: '물복',
    secondOption: '딱복',
    password: '복복복',
  }

  const mutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: topicKeys.all }),
  })

  return (
    <>
      <div>
        <button onClick={() => mutation.mutate(newTopic)}>create todos</button>
      </div>
      <section>
        <h2>불타는 주제</h2>
        <HotTopics />
      </section>
      <section>
        <h2>새로운 주제</h2>
        <NewTopics />
      </section>
      <Link to="newTopic">글쓰기</Link>
    </>
  )
}
