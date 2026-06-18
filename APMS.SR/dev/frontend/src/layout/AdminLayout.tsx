import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      <aside style={{ width: 240 }}>
        {/* AdminSidebar */}
      </aside>

      <div style={{ flex: 1 }}>
        <Header />

        <main style={{ padding: 20 }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
}