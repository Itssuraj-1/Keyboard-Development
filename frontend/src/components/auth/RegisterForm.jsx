import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

/**
 * Minimal registration page with clean card design
 */
const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate("/home");
    } else {
      setApiError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Register Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-500">Create your account</p>
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm text-center">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={20} />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${
                errors.name ? "border-red-300" : "border-gray-200"
              } rounded-full focus:outline-none focus:border-black focus:bg-white transition-all`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 ml-4">{errors.name}</p>
            )}
          </div>

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
              } rounded-full focus:outline-none focus:border-black focus:bg-white transition-all`}
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
              } rounded-full focus:outline-none focus:border-black focus:bg-white transition-all`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-4">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${
                errors.confirmPassword ? "border-red-300" : "border-gray-200"
              } rounded-full focus:outline-none focus:border-black focus:bg-white transition-all`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 ml-4">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Checkbox - ONLY IN REGISTRATION */}
          <div className="flex items-center justify-center gap-2 py-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-black hover:underline cursor-pointer">
                terms and conditions
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
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

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-black font-semibold hover:underline"
              >
                Sign In
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

export default RegisterForm;
