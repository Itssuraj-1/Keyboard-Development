import api from "./axios";

export const analyticsAPI = {
  // Get user analytics (total likes, comments, views)
  getUserAnalytics: async (userId) => {
    try {
      // Get user's blogs
      const blogsResponse = await api.get(`/blogs/user/${userId}`);
      const blogs = blogsResponse.data.data.blogs;

      // Calculate analytics
      const totalBlogs = blogs.length;
      const totalLikes = blogs.reduce((sum, blog) => sum + blog.likesCount, 0);
      const totalComments = blogs.reduce(
        (sum, blog) => sum + blog.commentsCount,
        0
      );

      // Calculate views (approximate based on likes + comments)
      const totalViews = totalLikes * 3 + totalComments * 2;

      return {
        totalBlogs,
        totalLikes,
        totalComments,
        totalViews,
        blogs,
      };
    } catch (error) {
      throw error;
    }
  },
};
