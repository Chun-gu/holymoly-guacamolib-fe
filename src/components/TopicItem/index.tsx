import { Topic } from '@/types'

export default function TopicItem(topic: Topic) {
  return (
    <div>
      <span>{topic.id}</span>
      <h3>{topic.title}</h3>
      <p>{topic.content}</p>
      <div>
        <button>{topic.firstOption.content}</button>
        <button>{topic.secondOption.content}</button>
      </div>
    </div>
  )
}
