import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

import { getNewTopics, topicKeys } from '@/api/topic'
import { NewTopic } from '@/components'

export default function NewTopics() {
  const [observingTargetRef, inView] = useInView()

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

  if (inView && hasNextPage) fetchNextPage()

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
      <li ref={observingTargetRef} />
      {(isFetching || isFetchingNextPage) && <div>로딩 중...</div>}
    </ul>
  )
}
