import { formatDate } from '@/lib'

type Props = {
  comment: {
    id: string
    topicId: string
    index: number
    content: string
    createdAt: string
  }
}

export default function Comment({ comment }: Props) {
  return (
    <>
      <div>
        <span>익명{comment.index}</span>
        <span>{formatDate(comment.createdAt, 'absolute')}</span>
      </div>
      <p>{comment.content}</p>
      <button>삭제</button>
    </>
  )
}
