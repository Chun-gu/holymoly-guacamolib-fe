import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { createTopic, topicKeys } from '@/api/topic'
import { ReactComponent as Check } from '@/assets/check-icon.svg'
import { ReactComponent as Close } from '@/assets/close-icon.svg'
import { useLocalStorage } from '@/hooks'
import { queryClient } from '@/main'
import { NewTopic } from '@/types'

export default function NewTopicPage() {
  const navigate = useNavigate()

  const [createdTopics, setCreatedTopics] = useLocalStorage<number[]>(
    'createdTopics',
    [],
  )

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting, isValid },
  } = useForm<NewTopic>({
    mode: 'onChange',
  })

  const mutation = useMutation({
    mutationFn: createTopic,
    onSuccess: ({ createdTopicId }) => {
      setCreatedTopics([...createdTopics, +createdTopicId])
      queryClient.invalidateQueries(topicKeys.new)
      navigate('/', { replace: true })
    },
  })

  const onSubmit: SubmitHandler<NewTopic> = (newTopic) => {
    mutation.mutate(newTopic)
  }

  return (
    <Container>
      <Header>
        <button onClick={() => navigate('/', { replace: true })}>
          <Close />
        </button>
        <h2>주제 만들기</h2>
        <button form="newTopicForm" disabled={isSubmitting || !isValid}>
          <SaveButton isValid={isValid} />
        </button>
      </Header>

      <NewTopicForm id="newTopicForm" onSubmit={handleSubmit(onSubmit)}>
        <TitleInputWrapper>
          <label htmlFor="title" hidden>
            제목
          </label>
          <TitleInput
            id="title"
            type="text"
            maxLength={20}
            placeholder="토론 주제를 입력해 주세요 ex) 물복vs딱복"
            {...register('title', {
              required: '제목을 입력해주세요.',
              maxLength: {
                value: 20,
                message: '최대 20자까지 입력 가능합니다.',
              },
            })}
          />
        </TitleInputWrapper>
        <RestInputWrapper>
          <div>
            <label htmlFor="content" hidden>
              내용
            </label>
            <ContentInput
              id="content"
              maxLength={300}
              placeholder="주제에 대한 부가적인 설명이나&#10;논객님은 어떤 생각을 가지고 있는지 적어주세요"
              {...register('content', {
                required: '내용을 입력해주세요.',
                maxLength: {
                  value: 300,
                  message: '최대 300자까지 입력 가능합니다.',
                },
              })}
            />
          </div>

          <OptionInputWrapper>
            <OptionLabel htmlFor="firstOption">1번 선택지</OptionLabel>
            <input
              id="firstOption"
              type="text"
              maxLength={30}
              placeholder="ex) 물복"
              {...register('firstOption', {
                required: '선택지를 입력해주세요.',
                maxLength: {
                  value: 30,
                  message: '최대 30자까지 입력 가능합니다.',
                },
                validate: {
                  notSame: (v) =>
                    v !== getValues('secondOption') ||
                    '다른 선택지를 입력해주세요.',
                },
              })}
            />
          </OptionInputWrapper>

          <OptionInputWrapper>
            <OptionLabel htmlFor="secondOption">2번 선택지</OptionLabel>
            <input
              id="secondOption"
              type="text"
              maxLength={30}
              placeholder="ex) 딱복"
              {...register('secondOption', {
                required: '선택지를 입력해주세요.',
                maxLength: {
                  value: 30,
                  message: '최대 30자까지 입력 가능합니다.',
                },
                validate: {
                  notSame: (v) =>
                    v !== getValues('firstOption') ||
                    '다른 선택지를 입력해주세요.',
                },
              })}
            />
          </OptionInputWrapper>

          <OptionInputWrapper>
            <OptionLabel>비밀번호</OptionLabel>
            <input
              type="password"
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
                maxLength: {
                  value: 16,
                  message: '최대 16자까지 입력 가능합니다.',
                },
              })}
            />
          </OptionInputWrapper>

          <OptionsWrapper>
            <Option>{watch('firstOption') || '물복'}</Option>
            <Option>{watch('secondOption') || '딱복'}</Option>
          </OptionsWrapper>
        </RestInputWrapper>
      </NewTopicForm>
    </Container>
  )
}

const Container = styled.div`
  background-color: #ffffff;
`
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 10px 20px;
  background-color: #fdfad1;
`
const SaveButton = styled(Check)<{ isValid: boolean }>`
  path {
    fill: ${({ isValid }) => isValid && '#38AF61'};
  }
`
const NewTopicForm = styled.form`
  background-color: #ffffff;
  border: 1px solid #38af61;
`
const TitleInputWrapper = styled.div`
  padding: 26px 20px 12px 20px;
  border-bottom: 1px solid #e9e9e9;
`
const TitleInput = styled.input`
  display: block;
  width: 100%;
  border: none;
  font-size: 16px;
  &::placeholder {
    font-size: 16px;
    color: #7f7f7f;
  }
`
const RestInputWrapper = styled.div`
  padding: 18px 20px;
`
const ContentInput = styled.textarea`
  display: block;
  width: 100%;
  height: 100px;
  font-size: 14px;
  line-height: 1.5;
  border: none;
  resize: none;
  &::placeholder {
    font-size: 14px;
    color: #b9b9b9;
  }
`
const OptionInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  label: {
  }
  input {
    width: 225px;
    background-color: #f3f3f3;
    padding: 10px;
    border: none;
    &::placeholder {
      font-size: 14px;
      color: #b9b9b9;
    }
  }
`
const OptionLabel = styled.label`
  font-size: 14px;
  color: #b9b9b9;
`
const OptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`
const Option = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 137px;
  height: 186px;
  color: #b9b9b9;
  font-size: 14px;
  background-color: #e3e3e3;
  border-radius: 16px;
`
