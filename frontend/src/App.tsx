import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Main from "./pages/FMa/Main";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Monitor from "./pages/Monitor";

import MenuEditPage from "./pages/Fmenu/MenuEditPage";
import MenuPage from "./pages/Fmenu/MenuPage";
import PermissionPage from "./pages/Fpermi/PermissionPage";
import UserAdminPage from "./pages/FUsAd/UserAdminPage";
import RolePage from "./pages/FRole/RolePage";
import UserRolePage from "./pages/FRole/UserRolePage";

import { useEffect, useState } from "react";
import { bootstrapAuth } from "./auth/auth.bootstrap";

export default function App() {
	const [ready, setReady] = useState(false);
	
	useEffect(() => {
	  bootstrapAuth().finally(() => setReady(true));
	}, []);

	// 최초 인증 확인이 끝날 때까지 Route를 렌더링하지 않음
	if (!ready) {
	  return (
	    <div className="app-loading">
	      시스템을 확인하는 중입니다...
	    </div>
	  );
	}
	
  return (
    <BrowserRouter>
      <Routes>

        {/* 로그인 / 회원가입 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* 로그인 필요 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>		
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/menu" element={<MenuPage />} />

			{/* 메뉴 관리 */}
			<Route element={<AdminRoute permission="MENU_READ" />}>
				<Route path="/admin/menu/:id/edit" element={<MenuEditPage />} />
			</Route>  

			{/* 권한 관리 */}
			<Route element={<AdminRoute permission="PERMISSION_READ" />}>
            	  		  <Route path="/permission" element={<PermissionPage />} />
        	        </Route>  
			{/* 사용자 관리 */}
			<Route element={<AdminRoute permission="USER_READ" />}>
				<Route path="/Admin" element={<UserAdminPage />} />
			</Route>
			{/* 역할 관리 */}
			<Route element={<AdminRoute permission="ROLE_READ" />}>
				<Route path="/Role" element={<RolePage />} />
			</Route>
                        {/* 사용자 역할 */}
			<Route element={<AdminRoute permission="ROLE_READ" />}>
				<Route path="/URole" element={<UserRolePage />} />
			</Route>
	  </Route> </Route>

        {/* 일반 페이지 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<Home />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
