import { useMutation } from '@tanstack/react-query'

import { createTopic, topicKeys } from '@/api/topic'
import { HotTopics } from '@/components'
import { queryClient } from '@/main'

export default function MainPage() {
  const newTopic = {
    title: '물복 vs 딱복',
    content: '물복이 좋냐 딱복이 좋냐',
    firstOption: { content: '물복' },
    secondOption: { content: '딱복' },
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
        <ul></ul>
      </section>
      <button>글쓰기</button>
    </>
  )
}
