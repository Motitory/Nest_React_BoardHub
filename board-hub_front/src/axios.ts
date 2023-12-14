import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8000",
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지나 상태 관리 라이브러리에서 토큰을 가져옵니다
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
