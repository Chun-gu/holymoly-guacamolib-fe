import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header>
        <nav>내비게이션 바</nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
