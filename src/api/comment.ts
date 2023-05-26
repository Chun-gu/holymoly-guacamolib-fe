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

export const commentKey = {
  all: ['comments'] as const,
  list: (topicId: string) => [...commentKey.all, topicId],
}

export async function getComments(topicId: string): Promise<Comment[]> {
  const response = await client.get(`/topics/${topicId}/comments`)
  return response.data
}

export async function createComment({
  topicId,
  newComment,
}: {
  topicId: string
  newComment: NewComment
}): Promise<{ createdCommentId: string }> {
  const response = await client.post(`topics/${topicId}/comments`, {
    newComment,
  })
  return response.data
}

export async function deleteComment({
  topicId,
  commentId,
  password,
}: {
  topicId: string
  commentId: string
  password: string
}) {
  const response = await client.delete(
    `topics/${topicId}/comments/${commentId}`,
    { data: password },
  )
  return response.data
}
