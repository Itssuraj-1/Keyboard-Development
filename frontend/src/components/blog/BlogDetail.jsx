import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Edit, Trash2, User } from "lucide-react";
import { blogsAPI } from "../../api/blogs";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../common/Button";
import CommentSection from "./CommentSection";
import Modal from "../common/Modal";

/**
 * Blog detail view component
 */
const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeStatus, setLikeStatus] = useState({
    isLiked: false,
    likesCount: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlog();
    if (isAuthenticated) {
      fetchLikeStatus();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getBlogById(id);
      setBlog(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const response = await blogsAPI.getLikeStatus(id);
      setLikeStatus(response.data);
    } catch (err) {
      console.error("Failed to fetch like status:", err);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      // Redirect to login page with return path
      navigate("/login", {
        state: { from: `/blog/${id}`, message: "Please login to like blogs" },
      });
      return;
    }

    try {
      const response = await blogsAPI.toggleLike(id);
      setLikeStatus(response.data);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await blogsAPI.deleteBlog(id);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete blog");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!blog) return null;

  const isAuthor = user?._id === blog.author?._id;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Image */}
      <div className="w-full h-96 overflow-hidden rounded-lg mb-8">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

        {/* Author Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {blog.author?.avatar ? (
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={24} className="text-gray-500" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{blog.author?.name}</p>
              <p className="text-sm text-gray-500">
                {formatDate(blog.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons for Author */}
          {isAuthor && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 pb-6 border-b">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              likeStatus.isLiked ? "text-red-500" : "text-gray-500"
            } hover:text-red-500 transition-colors`}
            title={!isAuthenticated ? "Login to like" : ""}
          >
            <Heart
              size={20}
              fill={likeStatus.isLiked ? "currentColor" : "none"}
            />
            <span>{likeStatus.likesCount}</span>
          </button>
          <div className="flex items-center space-x-2 text-gray-500">
            <MessageCircle size={20} />
            <span>{blog.commentsCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Blog Content - Render HTML */}
      <div
        className="prose prose-lg max-w-none mb-12 prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-black prose-strong:text-gray-900 prose-code:text-gray-900 prose-pre:bg-gray-100 prose-blockquote:border-gray-900"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Comments Section */}
      <CommentSection blogId={id} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Blog"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogDetail;
