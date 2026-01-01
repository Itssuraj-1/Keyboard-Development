import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { analyticsAPI } from "../api/analytics";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Eye, Heart, MessageCircle, FileText } from "lucide-react";

/**
 * Analytics page showing user statistics
 */
const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getUserAnalytics(user._id);
      setAnalytics(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" fullScreen />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "Total Views",
      value: analytics.totalViews,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Likes",
      value: analytics.totalLikes,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Comments",
      value: analytics.totalComments,
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Blogs",
      value: analytics.totalBlogs,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">
            Track your blog performance and engagement
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={stat.color} size={24} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Blogs Performance */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Blogs Performance
            </h2>

            {analytics.blogs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                You haven't published any blogs yet. Start writing to see your
                analytics!
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Published on{" "}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Heart size={16} />
                        <span>{blog.likesCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={16} />
                        <span>{blog.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
