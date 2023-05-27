import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'

import Comment from '../Comment'

import { commentKey, getComments } from '@/api/comment'

export default function CommentList() {
  const { topicId } = useParams() as { topicId: string }
  const [observingTargetRef, inView] = useInView()

  const {
    isLoading,
    isError,
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: commentKey.list(topicId),
    queryFn: ({ pageParam }) => getComments({ topicId, pageParam }),
    getNextPageParam: ({ nextPage }) => nextPage,
  })

  if (inView && hasNextPage) fetchNextPage()

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  return (
    <>
      <ul>
        {comments.pages.map(({ comments }) =>
          comments.map((comment) => (
            <li key={comment.id}>
              <Comment comment={comment} />
            </li>
          )),
        )}
        <li ref={observingTargetRef} />
        {(isFetching || isFetchingNextPage) && <div>로딩 중...</div>}
      </ul>
    </>
  )
}
