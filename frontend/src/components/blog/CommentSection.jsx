import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { blogsAPI } from "../../api/blogs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import { Edit2, Trash2, User } from "lucide-react";

/**
 * Comment section component with add, edit, delete functionality
 */
const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getComments(blogId);
      setComments(response.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Redirect to login page with return path
      navigate("/login", {
        state: { from: `/blog/${id}`, message: "Please login to comment" },
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await blogsAPI.addComment(blogId, newComment);
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const response = await blogsAPI.updateComment(commentId, editContent);
      setComments(
        comments.map((c) => (c._id === commentId ? response.data : c))
      );
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await blogsAPI.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleLoginRedirect = () => {
    navigate("/login", {
      state: { from: `/blog/${id}`, message: "Please login to comment" },
    });
  };

  return (
    <div className="border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            maxLength={500}
          />
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
            >
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg text-center border-2 border-gray-200">
          <p className="text-gray-700 mb-3 text-base">
            Want to share your thoughts? Join the conversation!
          </p>
          <Button onClick={handleLoginRedirect} variant="primary" size="sm">
            Login to Comment
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {comment.author?.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {comment.author?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Edit/Delete buttons for comment author */}
                {user?._id === comment.author?._id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(comment)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editingId === comment._id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    rows="2"
                    maxLength={500}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEditComment(comment._id)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
