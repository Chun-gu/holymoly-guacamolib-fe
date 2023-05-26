import { rest } from 'msw'

import { db } from '../db'

type TopicSchema = {
  id: string
  title: string
  content: string
  firstOption: {
    content?: string
    count?: number
  }
  secondOption: {
    content?: string
    count?: number
  }
  createdAt: Date
}

function refineTopic(topic: TopicSchema) {
  return {
    id: topic.id,
    title: topic.title,
    content: topic.content,
    firstOption: {
      content: topic.firstOption.content,
      count: topic.firstOption.count,
    },
    secondOption: {
      content: topic.secondOption.content,
      count: topic.secondOption.count,
    },
    createdAt: topic.createdAt,
  }
}

const handlers = [
  // 전체 주제
  rest.get('/topics', (req, res, ctx) => {
    const sort = req.url.searchParams.get('sort')
    let topics

    if (sort === 'new')
      topics = db.topic.findMany({
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      })
    // else if (sort === 'hot')
    //   topics = db.topic.findMany({
    //     take: 5,
    //     orderBy: { commentsCount: 'desc' },
    //   })
    else topics = db.topic.getAll().map((topic) => refineTopic(topic))

    // if (topics) return res(ctx.json({ statusCode: 200, data: topics }))
    // else res(ctx.json({ statusCode: 500, data: '주제들을 가져오지 못했어요.' }))
    if (topics) return res(ctx.status(200), ctx.json(topics))
    else res(ctx.status(500), ctx.json({ data: '주제들을 가져오지 못했어요.' }))
  }),

  // 단일 주제
  rest.get('/topics/:topicId', (req, res, ctx) => {
    const { topicId } = req.params as { topicId: string }
    const topic = db.topic.findFirst({
      where: { id: { equals: topicId } },
    })

    if (topic) return res(ctx.status(200), ctx.json(refineTopic(topic)))
    else return res(ctx.status(404), ctx.json('존재하지 않는 주제예요.'))
  }),

  // 주제 생성
  rest.post('/topics', async (req, res, ctx) => {
    const { topic } = await req.json()
    const createdTopic = db.topic.create({
      title: topic.title,
      content: topic.content,
      firstOption: { content: topic.firstOption },
      secondOption: { content: topic.secondOption },
      password: topic.password,
    })

    if (createdTopic)
      return res(ctx.status(200), ctx.json({ createdTopicId: createdTopic.id }))
    else
      return res(ctx.json({ statusCode: 500, data: '주제를 만들지 못했어요.' }))
  }),

  // 주제 삭제
  rest.delete('/topics/:topicId', async (req, res, ctx) => {
    const { topicId } = req.params as { topicId: string }
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

    const isPasswordMatch = foundTopic.password === password

    if (!isPasswordMatch)
      return res(
        ctx.json({ statusCode: 401, data: '비밀번호를 확인해주세요.' }),
      )

    const deleted = db.topic.delete({
      where: { id: { equals: topicId } },
    })

    if (deleted)
      return res(ctx.status(200), ctx.json({ deletedTopicId: topicId }))
    else return res(ctx.status(500))
  }),

  // 투표
  rest.post('/topics/:topicId/vote', async (req, res, ctx) => {
    const { topicId } = req.params as { topicId: string }
    const { votedOption } = await req.json()
    const foundTopic = db.topic.findFirst({
      where: { id: { equals: topicId } },
    })

    if (!foundTopic)
      return res(ctx.status(404), ctx.json('존재하지 않는 주제예요.'))

    const updatedTopic = db.topic.update({
      where: { id: { equals: topicId } },
      data: {
        voteCount: (prevCount) => prevCount + 1,
        [votedOption]: {
          count: (prevCount: number) => prevCount + 1,
        },
      },
    })

    if (updatedTopic)
      return res(ctx.status(200), ctx.json({ votedTopicId: updatedTopic.id }))
    else return res(ctx.status(500))
  }),
]

export default handlers
