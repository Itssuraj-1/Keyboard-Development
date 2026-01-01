import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByUser,
  getMyBlogs,
} from "../controllers/blogController.js";

import { toggleLike, getLikeStatus } from "../controllers/likeController.js";

import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/my-blogs", protect, getMyBlogs);
router.get("/user/:userId", getBlogsByUser);
router.get("/:id", getBlogById);
router.post("/", protect, upload.single("coverImage"), createBlog);
router.put("/:id", protect, upload.single("coverImage"), updateBlog);
router.delete("/:id", protect, deleteBlog);

// Like routes
router.post("/:id/like", protect, toggleLike);
router.get("/:id/like-status", protect, getLikeStatus);

// Comment routes
router.get("/:id/comments", getComments);
router.post("/:id/comments", protect, addComment);
router.put("/comments/:id", protect, updateComment);
router.delete("/comments/:id", protect, deleteComment);

export default router;
