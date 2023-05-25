import { client } from './index'

type Comment = {
  id: string
  topicId: string
  index: number
  content: string
  createdAt: string
}

type NewComment = {
  content: string
  password: string
}

export async function getComments(topicId: string): Promise<Comment[]> {
  const response = await client.get(`/topics/${topicId}/comments`)
  return response.data
}

export async function createComment(topicId: string, newComment: NewComment) {
  const response = await client.post(`topics/${topicId}/comments`, {
    newComment,
  })
  return response.data
}

export async function deleteComment(topicId: string, commentId: string) {
  const response = await client.delete(
    `topics/${topicId}/comments/${commentId}`,
    { data: { topicId, commentId } },
  )
  return response.data
}
