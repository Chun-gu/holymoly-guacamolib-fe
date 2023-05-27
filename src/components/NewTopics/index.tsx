import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

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
  console.log(inView && hasNextPage)
  if (inView && hasNextPage) fetchNextPage()

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  return (
    <List>
      {newTopics.pages[0].topics.length === 0 && (
        <NoTopic>주제가 하나도 없어요.</NoTopic>
      )}
      {newTopics.pages.map(({ topics }) =>
        topics.map((topic) => (
          <li key={topic.id}>
            <Link to={`/topics/${topic.id}`}>
              <NewTopic topic={topic} />
            </Link>
          </li>
        )),
      )}
      <li ref={observingTargetRef} />
      {(isFetching || isFetchingNextPage) && <div>로딩 중...</div>}
    </List>
  )
}

const List = styled.ul`
  padding-bottom: 80px;
`

const NoTopic = styled.li`
  height: 221px;
  display: flex;
  justify-content: center;
  align-items: center;
`
