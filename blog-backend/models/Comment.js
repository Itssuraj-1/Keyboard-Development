import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
      trim: true,
      minlength: [1, 'Comment must be at least 1 character'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
commentSchema.index({ blog: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;