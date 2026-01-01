import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogsAPI } from "../api/blogs";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Upload,
  EyeOff,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";
import { formatDate } from "../utils/formatDate";

const MyBlogs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("published");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ published: 0, draft: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // three-dot menu control
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchMyBlogs();
    fetchCounts();
  }, [activeTab]);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getMyBlogs({ status: activeTab });
      setBlogs(response.data.blogs);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const [publishedRes, draftRes] = await Promise.all([
        blogsAPI.getMyBlogs({ status: "published", limit: 1 }),
        blogsAPI.getMyBlogs({ status: "draft", limit: 1 }),
      ]);

      setCounts({
        published: publishedRes.data.pagination.total,
        draft: draftRes.data.pagination.total,
      });
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    }
  };

  const handleEdit = (blogId) => {
    navigate(`/edit/${blogId}`);
    setOpenMenuId(null);
  };

  const handleView = (blogId) => {
    navigate(`/blog/${blogId}`);
    setOpenMenuId(null);
  };

  const handlePublish = async (blog) => {
    try {
      setUpdatingStatus(blog._id);
      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("content", blog.content);
      formData.append("status", "published");

      await blogsAPI.updateBlog(blog._id, formData);

      // Refresh both tabs and counts
      fetchMyBlogs();
      fetchCounts();
      setOpenMenuId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish blog");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleUnpublish = async (blog) => {
    try {
      setUpdatingStatus(blog._id);
      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("content", blog.content);
      formData.append("status", "draft");

      await blogsAPI.updateBlog(blog._id, formData);

      // Refresh both tabs and counts
      fetchMyBlogs();
      fetchCounts();
      setOpenMenuId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unpublish blog");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await blogsAPI.deleteBlog(blogToDelete._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blogToDelete._id));
      fetchCounts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete blog");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setBlogToDelete(null);
    }
  };

  // Strip HTML tags and truncate content
  const truncateContent = (htmlContent, maxLength = 100) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    if (textContent.length <= maxLength) return textContent;
    return textContent.slice(0, maxLength) + "...";
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Blogs
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your published posts and drafts
          </p>
        </div>

        {/* Tabs */}
        <Card className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6">
              <button
                onClick={() => setActiveTab("published")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                  activeTab === "published"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Published ({counts.published})
              </button>
              <button
                onClick={() => setActiveTab("draft")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                  activeTab === "draft"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Drafts ({counts.draft})
              </button>
            </nav>
          </div>

          {/* Blog List */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <LoadingSpinner size="md" />
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-base sm:text-lg mb-4">
                  {activeTab === "published"
                    ? "You haven't published any blogs yet"
                    : "You don't have any drafts"}
                </p>
                <Button variant="primary" onClick={() => navigate("/create")}>
                  Write Your First Blog
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Mobile Layout (< 640px) - Clean Horizontal */}
                    <div className="sm:hidden flex gap-3">
                      {/* Cover Image - Consistent size */}
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded-md">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content - Takes remaining space */}
                      <div className="flex-1 min-w-0">
                        {/* Title - Larger for better readability */}
                        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>

                        {/* Stats - Slightly larger */}
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{formatDate(blog.updatedAt)}</span>
                          {activeTab === "published" && (
                            <>
                              <div className="flex items-center gap-1">
                                <Heart size={14} />
                                <span>{blog.likesCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                <span>{blog.commentsCount}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Three-dot Menu - Top Right */}
                      <div className="relative shrink-0">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === blog._id ? null : blog._id
                            )
                          }
                          className="p-1.5 rounded hover:bg-gray-100 active:bg-gray-200"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenuId === blog._id && (
                          <>
                            {/* Mobile backdrop */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                              {activeTab === "published" && (
                                <button
                                  onClick={() => handleView(blog._id)}
                                  className="flex items-center w-full px-4 py-3 text-base hover:bg-gray-50 rounded-t-lg"
                                >
                                  <Eye size={16} className="mr-2.5" />
                                  View
                                </button>
                              )}

                              <button
                                onClick={() => handleEdit(blog._id)}
                                className="flex items-center w-full px-4 py-3 text-base hover:bg-gray-50"
                              >
                                <Edit size={16} className="mr-2.5" />
                                Edit
                              </button>

                              {/* Publish/Unpublish in menu */}
                              <div className="border-t border-gray-100">
                                {activeTab === "published" ? (
                                  <button
                                    onClick={() => handleUnpublish(blog)}
                                    disabled={updatingStatus === blog._id}
                                    className="flex items-center w-full px-4 py-3 text-base hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    <EyeOff size={16} className="mr-2.5" />
                                    {updatingStatus === blog._id
                                      ? "Unpublishing..."
                                      : "Unpublish"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handlePublish(blog)}
                                    disabled={updatingStatus === blog._id}
                                    className="flex items-center w-full px-4 py-3 text-base hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    <Upload size={16} className="mr-2.5" />
                                    {updatingStatus === blog._id
                                      ? "Publishing..."
                                      : "Publish"}
                                  </button>
                                )}
                              </div>

                              <button
                                onClick={() => handleDeleteClick(blog)}
                                className="flex items-center w-full px-4 py-3 text-base text-red-600 hover:bg-red-50 border-t border-gray-100 rounded-b-lg"
                              >
                                <Trash2 size={16} className="mr-2.5" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tablet/Desktop Layout (>= 640px) */}
                    <div className="hidden sm:flex gap-3 md:gap-4">
                      {/* Cover Image */}
                      <div className="w-24 h-20 sm:w-32 sm:h-24 md:w-40 md:h-28 shrink-0 overflow-hidden rounded-md">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1 sm:line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1 sm:line-clamp-2">
                          {truncateContent(blog.content)}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
                          <span>{formatDate(blog.updatedAt)}</span>
                          {activeTab === "published" && (
                            <>
                              <div className="flex items-center space-x-1">
                                <Heart size={14} />
                                <span>{blog.likesCount}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle size={14} />
                                <span>{blog.commentsCount}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Tablet/Desktop */}
                      <div className="flex items-start gap-2 shrink-0">
                        {/* Publish/Unpublish Button */}
                        {activeTab === "published" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnpublish(blog)}
                            disabled={updatingStatus === blog._id}
                            className="hidden md:flex items-center whitespace-nowrap"
                          >
                            {updatingStatus === blog._id ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-4 w-4 mr-1"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Unpublishing
                              </span>
                            ) : (
                              <>
                                <EyeOff size={16} className="mr-1" />
                                Unpublish
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handlePublish(blog)}
                            disabled={updatingStatus === blog._id}
                            className="hidden md:flex items-center whitespace-nowrap"
                          >
                            {updatingStatus === blog._id ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-4 w-4 mr-1"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Publishing
                              </span>
                            ) : (
                              <>
                                <Upload size={16} className="mr-1" />
                                Publish
                              </>
                            )}
                          </Button>
                        )}

                        {/* Three-dot Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === blog._id ? null : blog._id
                              )
                            }
                            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenuId === blog._id && (
                            <>
                              {/* Backdrop for closing menu */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                {activeTab === "published" && (
                                  <button
                                    onClick={() => handleView(blog._id)}
                                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                                  >
                                    <Eye size={14} className="mr-2" />
                                    View
                                  </button>
                                )}

                                <button
                                  onClick={() => handleEdit(blog._id)}
                                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  <Edit size={14} className="mr-2" />
                                  Edit
                                </button>

                                {/* Show Publish/Unpublish in menu for tablet */}
                                <div className="md:hidden border-t border-gray-100">
                                  {activeTab === "published" ? (
                                    <button
                                      onClick={() => handleUnpublish(blog)}
                                      disabled={updatingStatus === blog._id}
                                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                                    >
                                      <EyeOff size={14} className="mr-2" />
                                      {updatingStatus === blog._id
                                        ? "Unpublishing..."
                                        : "Unpublish"}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handlePublish(blog)}
                                      disabled={updatingStatus === blog._id}
                                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                                    >
                                      <Upload size={14} className="mr-2" />
                                      {updatingStatus === blog._id
                                        ? "Publishing..."
                                        : "Publish"}
                                    </button>
                                  )}
                                </div>

                                <button
                                  onClick={() => handleDeleteClick(blog)}
                                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Blog"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{blogToDelete?.title}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default MyBlogs;
