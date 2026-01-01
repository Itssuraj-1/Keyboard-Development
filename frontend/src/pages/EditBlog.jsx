import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogsAPI } from "../api/blogs";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import BlogForm from "../components/blog/BlogForm";
import LoadingSpinner from "../components/common/LoadingSpinner";

/**
 * Edit existing blog page
 */
const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getBlogById(id);
      const blogData = response.data;

      // Check if user is the author
      if (blogData.author._id !== user._id) {
        setError("You are not authorized to edit this blog");
        setTimeout(() => navigate("/home"), 2000);
        return;
      }

      setBlog(blogData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" fullScreen />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Blog</h1>
          <p className="text-gray-600">Update your blog post</p>
        </div>
        {blog && <BlogForm blogId={id} initialData={blog} />}
      </div>
    </DashboardLayout>
  );
};

export default EditBlog;
