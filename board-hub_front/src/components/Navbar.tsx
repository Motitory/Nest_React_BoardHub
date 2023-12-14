import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리 로직
    localStorage.removeItem("accessToken"); // 로컬 스토리지에서 토큰 제거
    setUser(null); // 전역 사용자 상태를 null로 설정
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/board" className="text-xl font-semibold">
            MyBoard
          </Link>
        </div>
        <div>
          {user ? (
            <div className="flex items-center">
              <span className="mr-4">Hello, {user.nickname}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
