import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Header() {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem('token'))
    }

    window.addEventListener('storage', syncToken)
    return () => window.removeEventListener('storage', syncToken)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }

  return (
    <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/main">Main</Link>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {!token && <Link to="/signup">Signup</Link>}

        {token ? (
          <>
	    <Link to="/monitor">Monitor</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout}>로그아웃</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  )
}
