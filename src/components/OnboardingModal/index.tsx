import { useState } from 'react'

import styled from 'styled-components'

import onboardingBackground from '/onboarding-background.png'

import { useLocalStorage } from '@/hooks'

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(true)
  const [, setIsFirstVisit] = useLocalStorage('isFirstVisit', true)

  function handleStart() {
    setIsFirstVisit(false)
    setIsOpen(false)
  }

  return isOpen ? (
    <Overlay>
      <Container>
        <img src={onboardingBackground} />
        <StartButton onClick={handleStart}>시작하기</StartButton>
      </Container>
    </Overlay>
  ) : null
}

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
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
`

const StartButton = styled.button`
  position: absolute;
  bottom: 42px;
  right: 50%;
  transform: translateX(50%);
  width: 262px;
  height: 63px;
  background-color: #b8ff72;
  border-radius: 50px;
  font-size: 16px;
  font-weight: lighter;
  cursor: pointer;
`
