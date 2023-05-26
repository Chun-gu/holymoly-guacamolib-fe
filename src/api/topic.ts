// import { isAxiosError } from 'axios'

import { client } from './index'

import type { NewTopic, Topic } from '@/types'

// type ErrorResponse = {
//   statusCode: number
//   data: string
// }

export const topicKeys = {
  all: ['topics'] as const,
  hot: ['topics', 'hot'] as const,
  new: ['topics', 'new'] as const,
  topic: (id: string) => [...topicKeys.all, id] as const,
  sort: (sort: string) => ['topics', { sort }] as const,
  lists: () => [...topicKeys.all, 'list'] as const,
  list: (filters: string) => [...topicKeys.lists(), { filters }] as const,
  details: () => [...topicKeys.all, 'detail'] as const,
}

export async function getTopics(): Promise<Topic[]> {
  const response = await client.get('/topics')
  return response.data
  // try {
  // } catch (error) {
  //   if (isAxiosError<ErrorResponse>(error)) {
  //     return error.response?.data
  //   }
  // }

  // if (data.statusCode === 200) return { isSuccess: true, data: data.data }
  // else return { isSuccess: false, message: data.data }
}

export async function getHotTopics(): Promise<Topic[]> {
  const response = await client.get(`/topics?sort=hot`)
  return response.data
}

export async function getNewTopics({
  pageParam = 0,
}): Promise<{ topics: Topic[]; nextPage: number | undefined }> {
  const SIZE = 10
  const { data } = await client.get(
    `/topics?sort=new&size=${SIZE}&page=${pageParam}`,
  )
  const nextPage = data.length === SIZE ? pageParam + 1 : undefined
  return { topics: data, nextPage }
}

export async function getTopic(topicId: string): Promise<Topic> {
  // throw new Error('클라이언트 에러!')
  const response = await client.get(`/topics/${topicId}`)
  return response.data

  // if (data.statusCode === 200) return { isSuccess: true, data: data.data }
  // else return { isSuccess: false, message: data.data }
}

export async function createTopic(
  topic: NewTopic,
): Promise<{ createdTopicId: string }> {
  const response = await client.post(`/topics`, { topic })
  return response.data
}

export async function deleteTopic({
  topicId,
  password,
}: {
  topicId: string
  password: string
}): Promise<{ deletedTopicId: string }> {
  const response = await client.delete(`/topics/${topicId}`, {
    data: password,
  })

  return response.data
}

export async function vote({
  topicId,
  votedOption,
}: {
  topicId: string
  votedOption: string
}): Promise<{ votedTopicId: string }> {
  const response = await client.post(`/topics/${topicId}/vote`, { votedOption })
  return response.data
}
