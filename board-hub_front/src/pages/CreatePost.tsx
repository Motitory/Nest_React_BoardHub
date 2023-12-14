import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api"; // 백엔드 API 연동을 위한 함수
import { useUser } from "../contexts/UserContext"; // 사용자 정보를 가져오기 위한 커스텀 훅

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]); // 여러 파일을 위한 File 배열
  const navigate = useNavigate();
  const { user } = useUser(); // 현재 로그인된 사용자의 정보

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !user.id) {
      window.confirm("Please log in to create a post.");
      console.error("User not logged in");
      navigate("/login");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    files.forEach((file) => formData.append("files", file)); // 여러 파일을 formData에 추가

    try {
      await createPost(formData);
      navigate("/board");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(Array.from(event.target.files).slice(0, 3)); // 최대 3개 파일 선택
    } else {
      setFiles([]); // 파일이 선택되지 않았으면 빈 배열로 설정
    }
  };

  // 텍스트에서 줄바꿈을 <br> 태그로 변환
  function formatText(text: string): React.ReactNode {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  }

  return (
    <div className="container mx-auto my-8 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ resize: "none" }}
          >
            {formatText(content)}
          </textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Attach File (Up to 5)
          </label>
          <input
            type="file"
            id="file"
            multiple
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
