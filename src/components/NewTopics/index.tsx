import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getNewTopics, topicKeys } from '@/api/topic'
import { NewTopic } from '@/components'

export default function NewTopics() {
  const {
    isLoading,
    isError,
    data: newTopics,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: topicKeys.new,
    queryFn: getNewTopics,
    getNextPageParam: ({ nextPage }) => nextPage,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  if (newTopics.pages.length === 0) return <div>주제가 하나도 없어요.</div>

  return (
    <ul>
      {newTopics.pages.map(({ topics }) =>
        topics.map((topic) => (
          <li key={topic.id}>
            <Link to={`/topics/${topic.id}`}>
              <NewTopic topicId={topic.id} />
            </Link>
          </li>
        )),
      )}
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
    </ul>
  )
}
