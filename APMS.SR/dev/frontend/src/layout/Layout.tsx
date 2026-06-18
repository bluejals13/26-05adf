import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function Layout() {
  return (
    <div>

      <Header />

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>

    </div>
  )
}
