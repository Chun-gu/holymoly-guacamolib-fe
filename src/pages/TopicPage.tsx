import styled from 'styled-components'

import { CommentInput, CommentList, Topic } from '@/components'

export default function TopicPage() {
  return (
    <>
      <TopicSection>
        <Topic />
      </TopicSection>
      <section>
        <CommentSectionHeading>댓글</CommentSectionHeading>
        <CommentInput />
        <CommentList />
      </section>
    </>
  )
}

const TopicSection = styled.section`
  margin: 40px 0;
`
const CommentSectionHeading = styled.h2`
  font-size: 18px;
  color: #7f7f7f;
  margin-bottom: 16px;
`
