import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

import { ReactComponent as Logo } from '@/assets/logo.svg'

export default function Layout() {
  return (
    <Container>
      <header>
        <Nav>
          <Logo />
        </Nav>
      </header>
      <Main>
        <Outlet />
      </Main>
    </Container>
  )
}

const Container = styled.div`
  width: 375px;
  min-height: 100vh;
  margin: 0 auto;
`
const Nav = styled.nav`
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Main = styled.main`
  padding: 0 20px;
`
