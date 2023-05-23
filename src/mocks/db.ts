import { factory, manyOf, primaryKey } from '@mswjs/data'
import { nanoid } from 'nanoid'

export const db = factory({
  topic: {
    id: primaryKey(() => nanoid()),
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
    createdAt: () => new Date(),
    comments: manyOf('comment'),
    commentsCount: Number,
  },
  comment: {
    id: primaryKey(() => nanoid()),
    index: Number,
    content: String,
    password: String,
    createdAt: String,
  },
})
