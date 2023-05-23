export type Topic = {
  id: string
  content: string
  firstOption: { content: string; count: number }
  secondOption: { content: string; count: number }
  createdAt: string
}

export type NewTopic = Pick<
  Topic,
  'content' | 'firstOption' | 'secondOption'
> & { password: string }
