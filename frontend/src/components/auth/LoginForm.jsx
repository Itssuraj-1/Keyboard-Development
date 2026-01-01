import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

/**
 * Minimal login page with clean card design
 */
const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Check for redirect message (e.g., "Please login to like blogs")
  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(location.state.message);
      // Clear the message after showing it
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const result = await login(formData);

    if (result.success) {
      const from = location.state?.from || "/home";
      navigate(from);
    } else {
      setApiError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-500">Sign in to continue</p>
        </div>

        {/* Info Message (from redirect) */}
        {infoMessage && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-sm text-center">
            {infoMessage}
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm text-center">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${
                errors.email ? "border-red-300" : "border-gray-200"
              } rounded-full focus:outline-none focus:border-black focus:bg-white transition-all text-black placeholder-gray-400`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-4">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${
                errors.password ? "border-red-300" : "border-gray-200"
              } rounded-full focus:outline-none focus:border-black focus:bg-white transition-all text-black placeholder-gray-400`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-4">
                {errors.password}
              </p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-gray-500">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-black font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Back to Blogs */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to blogs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
