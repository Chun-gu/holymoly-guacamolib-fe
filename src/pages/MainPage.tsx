// import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

// import { createTopic, topicKeys } from '@/api/topic'
import { ReactComponent as Flame } from '@/assets/flame-icon.svg'
import { ReactComponent as New } from '@/assets/new-icon.svg'
import { ReactComponent as Pencil } from '@/assets/pencil-icon.svg'
import { HotTopics, NewTopics, OnboardingModal } from '@/components'
import { useLocalStorage } from '@/hooks'
// import { queryClient } from '@/main'

export default function MainPage() {
  const [isFirstVisit] = useLocalStorage('isFirstVisit', true)

  // const newTopic = {
  //   title: '물물물물물물물물물물물물물물물물물물물물',
  //   content:
  //     '물복이 좋냐 딱복이 좋냐 물복복이 좋냐 딱복이 좋냐물복이 좋냐물복이 좋냐물복이 좋냐 딱복이 좋냐물복이 좋냐 딱복이 좋냐물복이 좋냐 딱복이 좋냐물복이 좋냐 딱복이 좋냐물복이 좋냐 딱복이 좋냐물복이 좋냐 딱복이 좋냐물복이 좋냐 딱복이 좋냐물복냐',
  //   firstOption: '물물물물물물물물물물물물물물물물물물물물물물물물물물물물',
  //   secondOption: '딱복',
  //   password: '123',
  // }

  // const mutation = useMutation({
  //   mutationFn: createTopic,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: topicKeys.all }),
  // })

  return (
    <>
      {/* <div>
        <button onClick={() => mutation.mutate(newTopic)}>create todos</button>
      </div> */}
      <HotTopicSection>
        <SectionHeading>
          <Flame />
          <span>불타는 주제</span>
        </SectionHeading>
        <HotTopics />
      </HotTopicSection>
      <section>
        <SectionHeading>
          <New />
          <span>새로운 주제</span>
        </SectionHeading>
        <NewTopics />
      </section>
      <WriteNewTopic to="newTopic">
        <Pencil />
        글쓰기
      </WriteNewTopic>
      {isFirstVisit && <OnboardingModal />}
    </>
  )
}

const HotTopicSection = styled.section`
  margin-bottom: 49px;
`

const SectionHeading = styled.h2`
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  height: 37px;
  span {
    display: block;
    font-size: 20px;
    font-weight: lighter;
    margin-left: 8px;
    margin-bottom: 6px;
  }
`

const WriteNewTopic = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 115px;
  font-size: 16px;
  color: #ffffff;
  background-color: #41ac62;
  padding: 8px;
  border-radius: 50px;
  position: fixed;
  right: 50%;
  transform: translateX(50%);
  bottom: 30px;
  svg {
    margin-right: 4px;
  }
`
