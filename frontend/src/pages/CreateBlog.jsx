import DashboardLayout from "../components/layout/DashboardLayout";
import BlogForm from "../components/blog/BlogForm";

/**
 * Create new blog page
 */
const CreateBlog = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Write a New Blog
          </h1>
          <p className="text-gray-600">Share your thoughts with the world</p>
        </div>
        <BlogForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateBlog;
