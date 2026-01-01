import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
      minlength: [20, "Content must be at least 20 characters"],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    coverImage: {
      type: String,
      required: [true, "Please provide a cover image"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate comments
blogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blog",
  options: { sort: { createdAt: -1 } },
});

// Index for performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ title: "text", content: "text" });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
