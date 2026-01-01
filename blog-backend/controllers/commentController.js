import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get all comments for a blog
// @route   GET /api/blogs/:id/comments
// @access  Public
export const getComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments({ blog: req.params.id });

    const comments = await Comment.find({ blog: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return ApiResponse.success(res, 200, 'Comments retrieved successfully', {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a blog
// @route   POST /api/blogs/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return ApiResponse.error(res, 400, 'Please provide comment content');
    }

    // Check if blog exists
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return ApiResponse.error(res, 404, 'Blog not found');
    }

    // Create comment
    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      blog: req.params.id,
    });

    // Increment comments count
    blog.commentsCount += 1;
    await blog.save();

    // Populate author details
    await comment.populate('author', 'name avatar');

    return ApiResponse.success(res, 201, 'Comment added successfully', comment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return ApiResponse.error(res, 400, 'Please provide comment content');
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return ApiResponse.error(res, 404, 'Comment not found');
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return ApiResponse.error(res, 403, 'Not authorized to update this comment');
    }

    comment.content = content.trim();
    const updatedComment = await comment.save();
    await updatedComment.populate('author', 'name avatar');

    return ApiResponse.success(res, 200, 'Comment updated successfully', updatedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return ApiResponse.error(res, 404, 'Comment not found');
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return ApiResponse.error(res, 403, 'Not authorized to delete this comment');
    }

    // Decrement comments count
    const blog = await Blog.findById(comment.blog);
    if (blog) {
      blog.commentsCount = Math.max(0, blog.commentsCount - 1);
      await blog.save();
    }

    await comment.deleteOne();

    return ApiResponse.success(res, 200, 'Comment deleted successfully', null);
  } catch (error) {
    next(error);
  }
};