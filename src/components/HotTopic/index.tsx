import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { topicKeys, vote } from '@/api/topic'
import { useLocalStorage } from '@/hooks'
import { queryClient } from '@/main'
import { Topic } from '@/types'

type Props = {
  topic: Topic
}

export default function HotTopic({ topic }: Props) {
  const topicId = topic.id
  const [votedTopics, setVotedTopics] = useLocalStorage<string[]>(
    'votedTopics',
    [],
  )
  const isVotedTopic = votedTopics.includes(topicId)

  const mutation = useMutation({
    mutationFn: vote,
    onSuccess: ({ votedTopicId }) => {
      setVotedTopics([...votedTopics, votedTopicId])
      queryClient.invalidateQueries(topicKeys.topic(topicId))
    },
  })

  function handleVote(votedOption: string) {
    mutation.mutate({ topicId, votedOption })
  }

  return (
    <Container>
      <div>
        <Title>Q. {topic.title}</Title>
        <Content>{topic.content}</Content>
      </div>
      <OptionContainer>
        <Option
          onClick={() => handleVote('firstOption')}
          disabled={isVotedTopic}>
          <span>{topic.firstOption.content}</span>
        </Option>
        <Option
          onClick={() => handleVote('secondOption')}
          disabled={isVotedTopic}>
          {topic.secondOption.content}
        </Option>
      </OptionContainer>
      {isVotedTopic && <Link to={`/topics/${topicId}`}>의견 보러 가기</Link>}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 301px;
  height: 221px;
  background-color: #ffffff;
  padding: 18px 17px;
  border: 1px solid #33ac5f;
  border-radius: 20px;
`

const Title = styled.h3`
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 12px;
`

const Content = styled.p`
  font-size: 12px;
  line-height: 1.8;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

const OptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const Option = styled.button`
  width: 127px;
  height: 84px;
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
  background-color: #38af61;
  border-radius: 16px;
  cursor: pointer;
`
