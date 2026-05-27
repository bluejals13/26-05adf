import { useState } from 'react'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('about')
  const [boxActive, setBoxActive] = useState(false)

  return (
    <>
      <header>
        <h1>내 홈페이지</h1>

        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Service</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h2>안녕하세요 👋</h2>
        <p>탭 + 애니메이션 UI 통합 예제</p>

        <button
          className="btn"
          onClick={() => alert('버튼 클릭!')}
        >
          클릭
        </button>
      </section>

      {/* 박스 */}
      <div className="box-container">
        <div
          className={`box ${boxActive ? 'active' : ''}`}
          onClick={() => setBoxActive(!boxActive)}
        />
      </div>

      {/* 탭 */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>

        <button
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Service
        </button>

        <button
          className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>

      {/* 콘텐츠 */}
      {activeTab === 'about' && (
        <section className="tab-content active">
          <h2>About</h2>
          <p>소개 내용</p>
        </section>
      )}

      {activeTab === 'services' && (
        <section className="tab-content active">
          <h2>Services</h2>
          <p>웹 제작 / 디자인 / 개발</p>
        </section>
      )}

      {activeTab === 'contact' && (
        <section className="tab-content active">
          <h2>Contact</h2>
          <p>📧 email@example.com</p>
        </section>
      )}

      <footer>
        © 2026 내 홈페이지
      </footer>
    </>
  )
}
