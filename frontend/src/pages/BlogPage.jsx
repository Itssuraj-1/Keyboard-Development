import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import BlogDetail from "../components/blog/BlogDetail";
import Navbar from "../components/layout/Navbar";

/**
 * Individual blog page
 * Shows full dashboard for authenticated users
 * Shows navbar with Login/Register for guests
 */
const BlogPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <BlogDetail />
      </DashboardLayout>
    );
  }

  // Guest view with navbar (includes Login/Register buttons)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <BlogDetail />
      </div>
    </div>
  );
};

export default BlogPage;
