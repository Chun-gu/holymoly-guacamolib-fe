import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { deleteTopic, vote, topicKeys, getTopic } from '@/api/topic'
import { ReactComponent as Share } from '@/assets/share-icon.svg'
import { useLocalStorage } from '@/hooks'
import { formatDate } from '@/lib'
import { queryClient } from '@/main'

export default function Topic() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { topicId } = useParams() as { topicId: string }
  const navigate = useNavigate()
  const [createdTopics, setCreatedTopics] = useLocalStorage<number[]>(
    'createdTopics',
    [],
  )
  const isMyTopic = createdTopics.includes(+topicId)
  const [votedTopics, setVotedTopics] = useLocalStorage<number[]>(
    'votedTopics',
    [],
  )
  console.log(votedTopics)
  const isVotedTopic = votedTopics.includes(+topicId)
  console.log(isVotedTopic)

  const deleteMutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: ({ deletedTopicId }) => {
      const newCreatedTopics = createdTopics.filter(
        (topicId) => +topicId !== deletedTopicId,
      )
      setCreatedTopics(newCreatedTopics)
      navigate('/')
    },
  })

  const voteMutation = useMutation({
    mutationFn: vote,
    onSuccess: ({ votedTopicId }) => {
      setVotedTopics([...votedTopics, +votedTopicId])
      queryClient.invalidateQueries(topicKeys.topic(topicId))
    },
  })

  function handleVote(votedOption: string) {
    voteMutation.mutate({ topicId, votedOption })
  }

  const {
    isLoading,
    data: topic,
    isError,
  } = useQuery({
    queryKey: topicKeys.topic(topicId),
    queryFn: () => getTopic(topicId),
  })

  function toggleDeleteTopic() {
    setIsDeleteModalOpen((prev) => !prev)
  }

  useEffect(() => {
    if (isDeleteModalOpen) {
      document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`
    }
    return () => {
      const scrollY = document.body.style.top
      document.body.style.cssText = ''
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
    }
  }, [isDeleteModalOpen])

  const { register, handleSubmit } = useForm<{ password: string }>({
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<{ password: string }> = ({ password }) => {
    deleteMutation.mutate({ topicId, password })
  }

  if (isLoading) return <div>로딩 중..</div>
  if (isError) return <div>에러!</div>

  const firstOptionPercentage = Math.floor(
    (topic.firstOption.count /
      (topic.firstOption.count + topic.secondOption.count) || 0) * 100,
  )
  const secondOptionPercentage = Math.floor(
    (topic.secondOption.count /
      (topic.firstOption.count + topic.secondOption.count) || 0) * 100,
  )

  return (
    <>
      <Container>
        <Title>Q. {topic.title}</Title>
        <DateWrapper>
          <CreatedDate>{formatDate(topic.createAt, 'relative')}</CreatedDate>
          <DeleteAndShare>
            {isMyTopic && <button onClick={toggleDeleteTopic}>삭제</button>}
            <button>
              <Share />
            </button>
          </DeleteAndShare>
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
      {isDeleteModalOpen && (
        <Overlay>
          <ModalContainer>
            <p>
              주제를 <Delete>삭제</Delete>하시겠습니까?
            </p>
            <p>삭제하시려면 비밀번호를 입력해주세요</p>
            <form id="passwordConfirmForm" onSubmit={handleSubmit(onSubmit)}>
              <DeleteLabel htmlFor="password">비밀번호</DeleteLabel>
              <DeleteInput
                id="password"
                type="password"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                })}
              />
            </form>
            <div>
              <CancelButton onClick={toggleDeleteTopic}>취소</CancelButton>
              <DeleteButton form="passwordConfirmForm">삭제</DeleteButton>
            </div>
          </ModalContainer>
        </Overlay>
      )}
    </>
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
const DeleteAndShare = styled.div`
  display: flex;
  align-items: center;
  button {
    font-size: 13px;
    color: #b9b9b9;
  }
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
const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
`
const ModalContainer = styled.div`
  width: 300px;
  border-radius: 14px;
  color: #7f7f7f;
  background-color: #ffffff;
  padding: 20px;
  text-align: center;
  line-height: 1.5;
`
const DeleteLabel = styled.label`
  margin-right: 10px;
`
const DeleteInput = styled.input`
  height: 38px;
  border: none;
  background-color: #f3f3f3;
  margin: 10px 0 20px;
  padding: 0 10px;
`
const Delete = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #38af61;
`
const CancelButton = styled.button`
  width: 124px;
  height: 37px;
  font-size: 16px;
  color: #7f7f7f;
  border-radius: 50px;
  background-color: #f3f3f3;
  margin-right: 10px;
`
const DeleteButton = styled.button`
  width: 124px;
  height: 37px;
  font-size: 16px;
  color: #ffffff;
  border-radius: 50px;
  background-color: #38af61;
`
