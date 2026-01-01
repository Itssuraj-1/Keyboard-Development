import api from "./axios";

export const blogsAPI = {
  // Get all blogs with pagination and search
  getBlogs: async (params = {}) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },

  // Get single blog by ID
  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  // Create new blog
  createBlog: async (formData) => {
    const response = await api.post("/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update blog
  updateBlog: async (id, formData) => {
    const response = await api.put(`/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  // Get blogs by user
  getBlogsByUser: async (userId, params = {}) => {
    const response = await api.get(`/blogs/user/${userId}`, { params });
    return response.data;
  },

  // Toggle like on blog
  toggleLike: async (id) => {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  },

  // Get like status
  getLikeStatus: async (id) => {
    const response = await api.get(`/blogs/${id}/like-status`);
    return response.data;
  },

  // Get comments for blog
  getComments: async (blogId, params = {}) => {
    const response = await api.get(`/blogs/${blogId}/comments`, { params });
    return response.data;
  },

  // Add comment to blog
  addComment: async (blogId, content) => {
    const response = await api.post(`/blogs/${blogId}/comments`, { content });
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, content) => {
    const response = await api.put(`/blogs/comments/${commentId}`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/blogs/comments/${commentId}`);
    return response.data;
  },

  getMyBlogs: async (params = {}) => {
    const response = await api.get("/blogs/my-blogs", { params });
    return response.data;
  },
};
