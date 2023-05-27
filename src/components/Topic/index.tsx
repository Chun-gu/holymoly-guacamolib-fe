import { useRef, FormEvent } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { deleteTopic, vote, topicKeys, getTopic } from '@/api/topic'
import { ReactComponent as Share } from '@/assets/share-icon.svg'
import { useModal } from '@/contexts/ModalContext'
import { useLocalStorage } from '@/hooks'
import { formatDate } from '@/lib'
import { queryClient } from '@/main'

export default function Topic() {
  const { topicId } = useParams() as { topicId: string }
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [createdTopics, setCreatedTopics] = useLocalStorage<string[]>(
    'createdTopics',
    [],
  )
  const isMyTopic = createdTopics.includes(topicId)
  const [votedTopics, setVotedTopics] = useLocalStorage<string[]>(
    'votedTopics',
    [],
  )
  const isVotedTopic = votedTopics.includes(topicId)

  const { dispatch } = useModal()

  const openModal = () => {
    dispatch({
      type: 'OPEN_MODAL',
      content: '댓글을 삭제하시겠습니까?',
    })
  }

  const deleteMutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: ({ deletedTopicId }) => {
      const newCreatedTopics = createdTopics.filter(
        (topicId) => topicId !== deletedTopicId,
      )
      setCreatedTopics(newCreatedTopics)
      navigate('/')
    },
  })

  const voteMutation = useMutation({
    mutationFn: vote,
    onSuccess: ({ votedTopicId }) => {
      setVotedTopics([...votedTopics, votedTopicId])
      queryClient.invalidateQueries(topicKeys.topic(topicId))
    },
  })

  function handleVote(votedOption: string) {
    voteMutation.mutate({ topicId, votedOption })
  }

  function handleDeleteTopic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const password = passwordInputRef.current?.value

    if (!password) return alert('비밀번호를 입력하세요')

    deleteMutation.mutate({ topicId, password })
  }

  const {
    isLoading,
    data: topic,
    isError,
  } = useQuery({
    queryKey: topicKeys.topic(topicId),
    queryFn: () => getTopic(topicId),
  })

  if (isLoading) return <div>로딩 중..</div>
  if (isError) return <div>에러!</div>

  const firstOptionPercentage = Math.floor(
    (topic.firstOption.count / topic.voteCount || 0) * 100,
  )
  const secondOptionPercentage = Math.floor(
    (topic.secondOption.count / topic.voteCount || 0) * 100,
  )

  return (
    <Container>
      <Title>Q. {topic.title}</Title>
      <DateWrapper>
        <CreatedDate>{formatDate(topic.createdAt, 'relative')}</CreatedDate>
        {isMyTopic && (
          // <form onSubmit={handleDeleteTopic}>
          //   <label>
          //     비밀번호
          //     <input type="password" ref={passwordInputRef} />
          //   </label>
          <button onClick={openModal}>삭제</button>
          // </form>
        )}
        <button>
          <Share />
        </button>
      </DateWrapper>
      <Content>{topic.content}</Content>

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
  background-color: #ffffff;
  padding: 14px 18px;
  border: 1px solid #38af61;
  border-radius: 20px;
`
const Title = styled.h1`
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 6px;
`
const DateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`
const CreatedDate = styled.span`
  font-size: 13px;
  color: #b9b9b9;
`
const Content = styled.p`
  font-size: 12px;
  color: #7f7f7f;
  line-height: 2;
  margin-bottom: 28px;
`
const OptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const Option = styled.button`
  width: 139px;
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
  width: 139px;
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
