import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import Comment from '../Comment'

import { commentKey, getComments } from '@/api/comment'

export default function CommentList() {
  const { topicId } = useParams() as { topicId: string }

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
      </ul>
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage
            ? '더 불러오는 중...'
            : hasNextPage
            ? '더 불러오기'
            : '더 불러올 게 없어요'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? '가져오는 중' : null}</div>
    </>
  )
}
