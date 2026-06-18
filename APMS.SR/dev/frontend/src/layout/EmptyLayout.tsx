import { Outlet, Link } from 'react-router-dom'

export default function EmptyLayout() {
  return (
    <>
      <header style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Main</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </nav>
      </header>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  )
}
