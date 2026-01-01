import { useState, useEffect } from "react";
import { blogsAPI } from "../../api/blogs";
import BlogCard from "./BlogCard";
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../common/Button";

/**
 * Blog list component with search and pagination
 */
const BlogList = ({ searchQuery = "" }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchBlogs();
  }, [pagination.page, searchQuery]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getBlogs({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
      });

      setBlogs(response.data.blogs);
      setPagination(response.data.pagination);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && blogs.length === 0) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Search Results Info */}
      {searchQuery && (
        <div className="bg-gray-50 border-2 border-gray-900 text-gray-900 px-5 py-3 rounded-lg font-medium">
          <p>
            {pagination.total === 0 ? (
              <>No results found for <span className="font-bold">"{searchQuery}"</span></>
            ) : (
              <>
                Found <span className="font-bold">{pagination.total}</span> result{pagination.total !== 1 ? "s" : ""} for <span className="font-bold">"{searchQuery}"</span>
              </>
            )}
          </p>
        </div>
      )}

      {/* Blog List */}
      {blogs.length === 0 && !searchQuery ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blogs found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogList;