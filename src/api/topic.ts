import { client } from './index'

import type { NewTopic } from '@/types'

export async function getTopics() {
  const { data } = await client.get('/topics')

  if (data.statusCode === 200) return { isSuccess: true, data: data.data }
  else return { isSuccess: false, message: data.data }
}

export async function getTopic(topicId: string) {
  const { data } = await client.get(`/topics/${topicId}`)

  if (data.statusCode === 200) return { isSuccess: true, data: data.data }
  else return { isSuccess: false, message: data.data }
}

export async function createTopic(topic: NewTopic) {
  const { data } = await client.post(`/topics`, { topic })

  if (data.statusCode === 201) return { isSuccess: true, data: data.data }
  else return { isSuccess: false, message: data.data }
}

export async function deleteTopic(topicId: string, password: string) {
  const { data } = await client.delete(`/topics/${topicId}`, {
    data: password,
  })

  if (data.statusCode === 204) return { isSuccess: true }
  else return { isSuccess: false, message: data.data }
}

export async function vote(topicId: string, vote: string) {
  const { data } = await client.post(`/topics/${topicId}/vote`, { vote })
  if (data.statusCode === 204) return { isSuccess: true }
  else return { isSuccess: false, message: data.data }
}
