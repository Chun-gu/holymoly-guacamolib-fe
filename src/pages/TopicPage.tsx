import { CommentInput, CommentList, Topic } from '@/components'

export default function TopicPage() {
  return (
    <>
      <section>
        <Topic />
      </section>
      <section>
        <h3>댓글</h3>
        <CommentInput />
        <CommentList />
      </section>
    </>
  )
}
