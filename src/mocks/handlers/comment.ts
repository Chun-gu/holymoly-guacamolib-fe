import { rest } from 'msw'

import { db } from '../db'

type NewComment = {
  newComment: { content?: string; password?: string }
}

const handlers = [
  // 특정 주제의 댓글 목록
  rest.get('/topics/:topicId/comments', (req, res, ctx) => {
    const { topicId } = req.params as { topicId: string }
    const { limit, skip } = Object.fromEntries(req.url.searchParams.entries())
    console.log(topicId, limit, skip)

    if (!topicId)
      return res(ctx.status(404), ctx.json({ data: '존재하지 않는 주제예요.' }))

    const foundComments = db.comment.findMany({
      where: { topicId: { equals: topicId } },
    })
    console.log(foundComments)
    if (foundComments) return res(ctx.status(200), ctx.json(foundComments))
  }),

  // 댓글 작성
  rest.post('/topics/:topicId/comments', async (req, res, ctx) => {
    const { topicId } = req.params as { topicId: string }
    const foundTopic = db.topic.findFirst({
      where: { id: { equals: topicId } },
    })

    if (!foundTopic)
      return res(ctx.status(404), ctx.json({ data: '존재하지 않는 주제예요.' }))

    const {
      newComment: { content, password },
    } = await req.json<NewComment>()

    if (!content || !password)
      return res(ctx.status(400), ctx.json({ data: '입력값을 확인해주세요' }))

    const index = foundTopic.commentCount + 1
    const updatedTopic = db.topic.update({
      where: { id: { equals: topicId } },
      data: { commentCount: (prevCount) => prevCount + 1 },
    })
    const createdComment = db.comment.create({
      topicId,
      index,
      content,
      password,
    })
    console.log(updatedTopic, createdComment)
    if (updatedTopic && createdComment)
      return res(ctx.status(201), ctx.json(createdComment))
    else return res(ctx.status(500))
  }),

  // 댓글 삭제
  rest.delete('/topics/:topicId/comments/:commentId', async (req, res, ctx) => {
    const { topicId, commentId } = req.params as {
      topicId: string
      commentId: string
    }
    const password = await req.text()

    if (!password)
      return res(
        ctx.json({ statusCode: 401, data: '비밀번호를 확인해주세요.' }),
      )

    const foundTopic = db.topic.findFirst({
      where: { id: { equals: topicId } },
    })

    if (!foundTopic)
      return res(ctx.json({ statusCode: 404, data: '존재하지 않는 주제예요.' }))

    const foundComment = db.comment.findFirst({
      where: { id: { equals: commentId } },
    })

    if (!foundComment)
      return res(
        ctx.status(404),
        ctx.json({ data: '존재하지 않는 댓글이에요.' }),
      )

    const isPasswordMatch = foundComment.password === password

    if (!isPasswordMatch)
      return res(
        ctx.json({ statusCode: 401, data: '비밀번호를 확인해주세요.' }),
      )

    const deleted = db.comment.delete({
      where: { id: { equals: commentId } },
    })

    if (deleted) return res(ctx.status(204))
    else return res(ctx.status(500))
  }),
]

export default handlers
