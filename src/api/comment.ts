import { client } from './index'

type Comment = {
  id: string
  topicId: string
  index: number
  content: string
  createAt: string
}

type NewComment = {
  content: string
  password: string
}

export const commentKey = {
  all: ['comments'] as const,
  list: (topicId: string) => [...commentKey.all, topicId],
}

export async function getComments({
  topicId,
  pageParam = 0,
}: {
  topicId: string
  pageParam: number
}): Promise<{ comments: Comment[]; nextPage: number | undefined }> {
  const SIZE = 10
  const { data } = await client.get(
    `/topics/${topicId}/comments?size=${SIZE}&page=${pageParam}`,
  )
  const nextPage = data.length === SIZE ? pageParam + 1 : undefined

  return { comments: data, nextPage }
}

export async function createComment({
  topicId,
  newComment,
}: {
  topicId: string
  newComment: NewComment
}): Promise<{ createdCommentId: string }> {
  const response = await client.post(`topics/${topicId}/comments`, {
    ...newComment,
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
}): Promise<{ deletedCommentId: string }> {
  const response = await client.delete(
    `topics/${topicId}/comments/${commentId}`,
    { data: { password } },
  )
  return response.data
}
