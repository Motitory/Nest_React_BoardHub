import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../api";
import { useUser } from "../contexts/UserContext";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: { nickname: string } | null;
}

const Board = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const navigate = useNavigate();
  const pageNumber = 5;
  const { user } = useUser(); // 현재 로그인된 사용자의 정보

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { posts, total } = await fetchPosts(
          currentPage,
          pageNumber,
          searchTerm,
          sortOrder
        );
        setPosts(posts);
        setTotalPages(total);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    loadPosts();
  }, [currentPage, searchTerm, sortOrder]);

  // 게시글을 정렬하는 함수
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
  });

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "DESC" ? "ASC" : "DESC"));
  };

  const handleCreatePost = () => {
    if (!user || !user.id) {
      window.confirm("Please log in to create a post.");
      console.error("User not logged in");
      navigate("/login");
      return;
    }
    navigate("/create-post");
  };

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="container mx-auto my-8 p-4 bg-white shadow rounded">
      {/* 검색 기능 */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="text"
            className="border px-3 py-1 mr-2"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
          />
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
          >
            Search
          </button>
        </div>
        <button
          onClick={handleCreatePost}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Post
        </button>
      </div>
      <button
        onClick={toggleSortOrder}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        {sortOrder === "DESC" ? "오래된 순으로 보기" : "최신 순으로 보기"}
      </button>

      {/* 게시글 목록 */}
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => handlePostClick(post.id)}
          className="mb-4 p-4 border-b cursor-pointer"
        >
          <h6 className="text-xs text-indigo-700  font-extrabold">{post.id}</h6>
          <h3 className="text-lg text-teal-700  font-extrabold">
            제목 : {post.title}
          </h3>
          <p className="text-pink-700 text-sm font-mono">
            내용 : {post.content}
          </p>
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
              작성자 : {post.author?.nickname || "Unknown"}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              }) +
                " " +
                new Date(post.createdAt).toLocaleTimeString("ko-KR", {
                  timeZone: "UTC",
                })}
            </div>
          </div>
        </div>
      ))}

      {/* 페이지네이션 */}
      <div className="mt-4 flex justify-center">
        {Array.from(
          {
            length:
              totalPages % pageNumber
                ? totalPages / pageNumber + 1
                : totalPages / pageNumber,
          },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Board;
