import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteFile, fetchPostDetail, updatePost } from "../api";
import { useUser } from "../contexts/UserContext";

interface ExistingFile {
  id: number;
  filename: string;
  path: string;
}

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]); // 기존 파일 목록 상태 추가
  const navigate = useNavigate();
  const { user } = useUser();
  const postNumber = id ? parseInt(id) : NaN;

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postId = id ? parseInt(id) : NaN;
        if (!isNaN(postId)) {
          const fetchedPost = await fetchPostDetail(postId);
          setTitle(fetchedPost.title);
          setContent(fetchedPost.content);
          setExistingFiles(fetchedPost.files || []);
        }
      } catch (error) {
        console.error("Failed to load post:", error);
      }
    };
    loadPost();
  }, [id]);

  const handleExistingFileRemove = async (fileId: number) => {
    try {
      await deleteFile(fileId); // 파일 삭제 API 호출
      setExistingFiles(existingFiles.filter((file) => file.id !== fileId)); // 상태 업데이트
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    files.forEach((file) => formData.append("files", file)); // 새로 추가된 파일들만 추가

    // 수정 요청을 보냄
    try {
      await updatePost(postNumber, formData);
      navigate(-1);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

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
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
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
            {" "}
            {formatText(content)}
          </textarea>
        </div>
        <div className="mb-4">
          {/* File Upload Field */}
          <label
            htmlFor="file"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Attach Files
          </label>
          {/* 기존 파일 목록 표시 및 삭제 버튼 */}
          {existingFiles.map((file, index) => (
            <div key={index} className="flex items-center mb-1">
              <span className="mr-2">{file.filename}</span>
              <button
                type="button"
                onClick={() => handleExistingFileRemove(file.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <input
            type="file"
            id="file"
            multiple
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleFileChange}
          />
          {/* Display selected files */}
          <div className="mt-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center mb-1">
                <span className="mr-2">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleFileRemove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Other Form Fields */}
        {/* Submit and Cancel Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate(`/post/${postNumber}`)}
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

export default EditPost;
