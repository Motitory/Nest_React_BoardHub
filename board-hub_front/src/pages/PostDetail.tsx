import React, { useState, useEffect, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createComment,
  deleteComment,
  deletePost,
  fetchComments,
  fetchPostDetail,
  updateComment,
} from "../api";
import { useUser } from "../contexts/UserContext";
import { FaArrowLeft } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  files: {
    filename: string;
    path: string;
  }[];
  author: { id: number; nickname: string };
}

interface Comment {
  id: number;
  content: string;
  author: { id: number; nickname: string };
}

const fileDownloadUrl = process.env.REACT_APP_BACKEND_URL + "/files/download/";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const { user: currentUser } = useUser();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  const handleDelete = async () => {
    if (post && window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id);
        navigate("/board"); // 삭제 후 게시판으로 이동
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  // 댓글 로드 함수
  const loadComments = async () => {
    try {
      const postId = id ? parseInt(id) : NaN;
      if (!isNaN(postId)) {
        const fetchedComments = await fetchComments(postId);
        setComments(fetchedComments);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  // 새 댓글 제출 함수
  const handleAddComment = async () => {
    if (!post || !currentUser || !newComment.trim()) {
      window.confirm("Please log in to create a comment.");
      console.error("User not logged in");
      navigate("/login");
      return;
    }

    try {
      // 새 댓글 추가 API 함수를 호출합니다.
      await createComment(post.id, newComment);
      setNewComment(""); // 입력 필드 초기화
      loadComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // 댓글 수정 모드 진입
  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  // 댓글 수정 취소
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  // 댓글 수정 완료
  const submitEdit = async () => {
    if (!post || !editingCommentId || !editedContent.trim()) return;

    try {
      await updateComment(post.id, editingCommentId, editedContent);
      setEditingCommentId(null);
      setEditedContent("");
      loadComments();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId: number) => {
    if (!post) return;

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        console.log(post.id, commentId);
        await deleteComment(post.id, commentId);
        console.log(`/post/${post.id}`);
        loadComments();
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
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

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postId = id ? parseInt(id) : NaN;
        if (isNaN(postId)) return;
        const fetchedPost = await fetchPostDetail(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };
    loadPost();
    loadComments();
  }, [id]);

  useEffect(() => {}, [post, currentUser]); // 'user' 대신 'currentUser'를 사용

  if (!post) return <div>Loading...</div>;

  const isImageFile = (filename: string) =>
    /\.(jpg|jpeg|png|gif)$/i.test(filename);

  return (
    <div className="container mx-auto my-8 p-4 bg-white shadow rounded">
      <div className="flex justify-between">
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 my-4 px-4 rounded mr-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="" />
        </button>
        <h4 className="text-gray-500 text-2xl mb-4 pr-12">{post.id}</h4>
      </div>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 mb-4">{formatText(post.content)}</p>
      <p className="text-gray-600 text-sm mb-4">
        Posted on: {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="mb-4">
        {post.files &&
          post.files.map((file, index) => (
            <div key={index} className="mb-2">
              <span>{file.filename}</span>
              {isImageFile(file.filename) ? (
                // 이미지 파일인 경우 미리보기
                <div className="flex items-center space-x-2">
                  <a
                    href={fileDownloadUrl + file.filename}
                    download
                    className="text-blue-500 hover:text-blue-800"
                  >
                    Download
                  </a>
                  <img
                    src={fileDownloadUrl + file.filename}
                    alt={`attachment-${index}`}
                    className="w-64 h-64 object-contain" // 이미지의 너비와 높이를 조절
                  />
                </div>
              ) : (
                // 이미지 파일이 아닌 경우 다운로드 링크
                <a
                  href={fileDownloadUrl + file.filename}
                  download
                  className="text-blue-500 hover:text-blue-800 ml-2"
                >
                  Download
                </a>
              )}
            </div>
          ))}
      </div>
      {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
        Like
      </button> */}
      {currentUser && currentUser.id === post.author.id && (
        <>
          <button
            onClick={() => navigate(`/edit-post/${post.id}`)}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </>
      )}
      {/* Comments Section */}
      <div className="mt-8">
        {/* 댓글 작성 폼 */}
        <div className="mb-4">
          <textarea
            className="w-full border rounded p-2 mb-2"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ resize: "none" }}
          />
          <button
            onClick={handleAddComment}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Comment
          </button>
        </div>
        {/* 댓글 목록 */}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="mb-2 p-2 border border-gray-300 rounded-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                작성자: {comment.author?.nickname || "Unknown"}
              </div>
              {currentUser && currentUser.id === comment.author.id && (
                <div className="space-x-2">
                  <button
                    onClick={() => startEditing(comment)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
            {editingCommentId === comment.id ? (
              // 수정 모드 UI
              <div>
                <input
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full border rounded p-2 mb-2"
                  autoFocus
                />
                <button
                  onClick={submitEdit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // 일반 댓글 UI
              <p className="text-gray-700">{comment.content}</p>
            )}
          </div>
        ))}

        {/* ... */}
      </div>
    </div>
  );
};

export default PostDetail;
