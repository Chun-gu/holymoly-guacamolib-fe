import { factory, primaryKey } from '@mswjs/data'
import { nanoid } from 'nanoid'

export const db = factory({
  topic: {
    id: primaryKey(() => nanoid()),
    title: String,
    content: String,
    firstOption: {
      content: String,
      count: () => 0,
    },
    secondOption: {
      content: String,
      count: () => 0,
    },
    password: String,
    voteCount: () => 0,
    commentCount: () => 0,
    createdAt: () => new Date(),
  },
  comment: {
    id: primaryKey(() => nanoid()),
    topicId: String,
    index: Number,
    content: String,
    password: String,
    createdAt: () => new Date(),
  },
})
