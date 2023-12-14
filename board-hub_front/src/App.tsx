import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import Board from "./pages/Board";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import { UserContext, UserProvider } from "./contexts/UserContext";
import { getUserInfo } from "./api";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

const AppContent = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      getUserInfo(accessToken)
        .then((userInfo) => {
          setUser(userInfo);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          // 옵션: 인증 실패 시 토큰을 삭제하고 로그인 페이지로 리다이렉트
        });
    }
  }, [setUser]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/board" element={<Board />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        {/* 다른 라우트 설정 */}
      </Routes>
    </>
  );
};

export default App;
