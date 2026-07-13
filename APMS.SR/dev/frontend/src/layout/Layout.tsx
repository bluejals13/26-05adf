import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function Layout() {
  return (
    <div>

      <Header />

      <main style={{ padding: 12 }}>
        <Outlet />
      </main>

    </div>
  )
}
