import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import EmptyLayout from "./layout/EmptyLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import Main from "./pages/FMa/Main";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Monitor from "./pages/Monitor";

import MenuPage from "./pages/Fmenu/MenuPage";
import PermissionPage from "./pages/Fpermi/PermissionPage";
import UserAdminPage from "./pages/FUsAd/UserAdminPage";

import { bootstrapAuth } from "./auth/auth.bootstrap";

export default function App() {
  useEffect(() => {
    bootstrapAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Layout 없는 영역 */}
        <Route element={<EmptyLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* 보호 영역 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>		
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/permission" element={<PermissionPage />} />
            <Route path="/user" element={<UserAdminPage />} />
	  </Route> </Route>

        {/* Layout 있는 영역 */}
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
