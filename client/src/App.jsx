import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomePage from "./pages/Hero";
import Dashboard from "./pages/dashboard";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/Login";
import { ToastContainer, toast } from "react-toastify";
import ProfileSetupPage from "./pages/profile/setUp";
import BrowsePage from "./pages/profile/browseProfile";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/profile" element={<ProfileSetupPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000} // auto close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // or "dark"
      />
    </>
  );
}

export default App;
