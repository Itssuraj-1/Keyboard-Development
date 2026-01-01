import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import BlogList from "../components/blog/BlogList";
import Navbar from "../components/layout/Navbar";

/**
 * Home page - displays blog feed
 * Shows full dashboard for authenticated users
 * Shows navbar with Login/Register for guests
 */
const Home = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (isAuthenticated) {
    return (
      <DashboardLayout onSearch={handleSearch}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Latest Blogs
            </h1>
            <p className="text-gray-600">
              Discover stories from writers around the world
            </p>
          </div>
          <BlogList searchQuery={searchQuery} />
        </div>
      </DashboardLayout>
    );
  }

  // Guest view with navbar (includes Login/Register buttons)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Latest Blogs
          </h1>
          <p className="text-gray-600">
            Discover stories from writers around the world
          </p>
        </div>
        <BlogList searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Home;
