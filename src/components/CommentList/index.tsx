import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

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
    // isFetching,
    // isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: commentKey.list(topicId),
    queryFn: ({ pageParam }) => getComments({ topicId, pageParam }),
    getNextPageParam: ({ nextPage }) => nextPage,
  })

  if (inView && hasNextPage) fetchNextPage()

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러!</div>

  if (comments.pages[0].comments.length !== 0)
    return (
      <List>
        {comments.pages.map(({ comments }) =>
          comments.map((comment) => (
            <ListItem key={comment.id}>
              <Comment comment={comment} />
            </ListItem>
          )),
        )}
        <li ref={observingTargetRef} />
        {/* {(isFetching || isFetchingNextPage) && <div>로딩 중...</div>} */}
      </List>
    )
}

const List = styled.ul`
  background-color: #ffffff;
  padding: 0 6px;
  border: 1px solid #33ac5f;
  margin-bottom: 20px;
`
const ListItem = styled.li`
  padding: 12px 0;
  &:nth-child(n + 2) {
    border-top: 1px solid #c9c9c9;
  }
`
