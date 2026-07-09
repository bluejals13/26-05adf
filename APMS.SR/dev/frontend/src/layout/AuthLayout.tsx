import { Outlet, Link } from 'react-router-dom'
import AuthHeader from "../components/AuthHeader";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      
      <AuthHeader />

     <main>
       <Outlet />
     </main>

   </div>

    </div>
  );
}
