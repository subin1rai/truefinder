
import "./App.css";
import HomePage from "./pages/Hero";
import Dashboard from "./pages/dashboard";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import ProfileSetupPage from "./pages/profile/setUp";
import BrowsePage from "./pages/profile/browseProfile";
import MainChat from "./pages/Chat/MainChat";
import {Provider } from "react-redux";
import store, { persistor } from "./redux/store/store";
import { PersistGate } from "redux-persist/integration/react";
function App() {

  return (
    <>
    <Provider store={store}>
      <PersistGate vloading={null} persistor={persistor}>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/profile" element={<ProfileSetupPage />} />
        <Route path="/chat" element={<MainChat />} />
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
        </PersistGate>
        </Provider>
    </>
  );
}

export default App;
