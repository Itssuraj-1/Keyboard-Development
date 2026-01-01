import { Heart, MessageCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import Card from "../common/Card";

/**
 * Responsive blog card component for displaying blog preview
 */
const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  // Strip HTML tags and truncate content
  const truncateContent = (htmlContent, maxLength = 150) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    if (textContent.length <= maxLength) return textContent;
    return textContent.slice(0, maxLength) + "...";
  };

  return (
    <Card hover onClick={handleClick}>
      <div className="flex flex-col sm:flex-row">
        {/* Cover Image */}
        <div className="w-full sm:w-1/3 h-48 sm:h-auto overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Author Info */}
            <div className="flex items-center space-x-2 mb-3">
              {blog.author?.avatar ? (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <User size={16} className="text-gray-500" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {blog.author?.name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(blog.createdAt)}
                </p>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:underline">
              {blog.title}
            </h3>

            {/* Content Preview */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 sm:line-clamp-3">
              {truncateContent(blog.content)}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <div className="flex items-center space-x-1">
              <Heart size={16} />
              <span>{blog.likesCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span>{blog.commentsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
