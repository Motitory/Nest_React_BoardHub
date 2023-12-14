import axios from "./axios";
import Axios, { AxiosError } from "axios";

export const registerUser = async (
  email: string,
  password: string,
  nickname: string
) => {
  try {
    const response = await axios.post("/users/register", {
      email,
      password,
      nickname,
    });
    return response.data;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      // AxiosError 타입 확인
      throw error.response?.data;
    }
    throw error;
  }
};

export const getUserInfo = async (token: any) => {
  try {
    const response = await axios.get("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      // AxiosError 타입 확인
      throw error.response?.data;
    }
    throw error;
  }
};

export const fetchPosts = async (
  page = 1,
  limit = 10,
  search = "",
  sortOrder = "desc"
) => {
  try {
    const response = await axios.get(
      `/posts?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}&sortOrder=${sortOrder}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const createPost = async (formData: FormData) => {
  try {
    const response = await axios.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const fetchPostDetail = async (postId: number) => {
  try {
    const response = await axios.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const updatePost = async (postId: number, formData: FormData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put(`/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const deletePost = async (postId: number) => {
  try {
    const response = await axios.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const deleteFile = async (fileId: number) => {
  try {
    const response = await axios.delete(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// 댓글 조회
export const fetchComments = async (postId: number) => {
  try {
    const response = await axios.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 댓글 작성
export const createComment = async (postId: number, content: string) => {
  try {
    const response = await axios.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (
  postId: number,
  commentId: number,
  content: string
) => {
  try {
    const response = await axios.put(`/posts/${postId}/comments/${commentId}`, {
      content,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (postId: number, commentId: number) => {
  try {
    await axios.delete(`/posts/${postId}/comments/${commentId}`);
  } catch (error) {
    throw error;
  }
};
