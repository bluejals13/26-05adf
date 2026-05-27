import { Outlet } from 'react-router-dom'

export default function EmptyLayout() {
  return (
    <main style={{ padding: 20 }}>
      <Outlet />
    </main>
  )
}
