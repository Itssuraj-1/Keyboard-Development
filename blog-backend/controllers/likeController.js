import Blog from '../models/Blog.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Toggle like on a blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return ApiResponse.error(res, 404, 'Blog not found');
    }

    const userId = req.user._id;
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      // Unlike: remove user from likes array
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      blog.likesCount = Math.max(0, blog.likesCount - 1);
      await blog.save();

      return ApiResponse.success(res, 200, 'Blog unliked successfully', {
        isLiked: false,
        likesCount: blog.likesCount,
      });
    } else {
      // Like: add user to likes array
      blog.likes.push(userId);
      blog.likesCount += 1;
      await blog.save();

      return ApiResponse.success(res, 200, 'Blog liked successfully', {
        isLiked: true,
        likesCount: blog.likesCount,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get blog like status for current user
// @route   GET /api/blogs/:id/like-status
// @access  Private
export const getLikeStatus = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).select('likes likesCount');

    if (!blog) {
      return ApiResponse.error(res, 404, 'Blog not found');
    }

    const isLiked = blog.likes.includes(req.user._id);

    return ApiResponse.success(res, 200, 'Like status retrieved', {
      isLiked,
      likesCount: blog.likesCount,
    });
  } catch (error) {
    next(error);
  }
};