import styled from 'styled-components'

import { ReactComponent as Comment } from '@/assets/comment-icon.svg'
import { ReactComponent as Vote } from '@/assets/vote-icon.svg'
import { shortenNumber } from '@/lib'
import { Topic } from '@/types'

type Props = {
  topic: Topic
}

export default function NewTopic({ topic }: Props) {
  return (
    <Container>
      <Title>Q. {topic.title}</Title>
      <CountContainer>
        <Count>
          <Vote />
          <span>{shortenNumber(topic.voteCount)}</span>
        </Count>
        <Count>
          <Comment />
          <span>{shortenNumber(topic.commentCount)}</span>
        </Count>
      </CountContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 17px 21px;
  border: 1px solid #33ac5f;
  border-radius: 20px;
  margin-bottom: 14px;
`
const Title = styled.h3`
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
const CountContainer = styled.div`
  display: flex;
  gap: 10px;
`
const Count = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 4px;
  }
`
