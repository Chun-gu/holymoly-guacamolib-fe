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
  const firstOptionPercentage = Math.floor(
    (topic.firstOption.count / topic.voteCount || 0) * 100,
  )
  const secondOptionPercentage = Math.floor(
    (topic.secondOption.count / topic.voteCount || 0) * 100,
  )

  const mutation = useMutation({
    mutationFn: vote,
    onSuccess: ({ votedTopicId }) => {
      setVotedTopics([...votedTopics, votedTopicId])
      queryClient.invalidateQueries(topicKeys.hot)
    },
  })

  function handleVote(votedOption: string) {
    mutation.mutate({ topicId, votedOption })
  }

  return (
    <Container>
      <Link to={`topics/${topicId}`}>
        <div>
          <Title>Q. {topic.title}</Title>
          <Content>{topic.content}</Content>
        </div>
      </Link>
      {isVotedTopic ? (
        <ResultContainer>
          <Result>
            {topic.firstOption.content}
            <Dimmed>
              <Percentage height={firstOptionPercentage}>
                {`${firstOptionPercentage}% (${topic.firstOption.count}표)`}
              </Percentage>
              <Border />
            </Dimmed>
          </Result>
          <Result>
            {topic.secondOption.content}
            <Dimmed>
              <Percentage height={secondOptionPercentage}>
                {`${secondOptionPercentage}% (${topic.secondOption.count}표)`}
              </Percentage>
              <Border />
            </Dimmed>
          </Result>
        </ResultContainer>
      ) : (
        <OptionContainer>
          <Option
            onClick={() => handleVote('firstOption')}
            disabled={isVotedTopic}>
            {topic.firstOption.content}
          </Option>
          <Option
            onClick={() => handleVote('secondOption')}
            disabled={isVotedTopic}>
            {topic.secondOption.content}
          </Option>
        </OptionContainer>
      )}
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
const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const Result = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 127px;
  height: 84px;
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
  background-color: #38af61;
  border-radius: 16px;
`
const Dimmed = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 16px;
`
const Percentage = styled.div<{ height: number }>`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  min-height: 30px;
  height: ${({ height }) => `${height}%`};
  max-height: 100%;
  background-color: #33ac5f;
  border-radius: 16px;
  padding-bottom: 6px;
  text-align: center;
`
const Border = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  border: 3px solid #5fe18c;
  border-radius: 16px;
`
