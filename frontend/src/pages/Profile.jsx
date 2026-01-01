// frontend/src/pages/Profile.jsx - WITH AVATAR UPLOAD
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/auth";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { User, Upload, X } from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    password: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
    setSuccess("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Please select a valid image file",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Image size must be less than 5MB",
        }));
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, avatar: "" }));
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || "");
    const fileInput = document.getElementById("avatarInput");
    if (fileInput) fileInput.value = "";
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.password && formData.password.length < 6) {
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

    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("bio", formData.bio);

      // Add avatar if file selected
      if (avatarFile) {
        updateData.append("avatar", avatarFile);
      }

      // Only include password if provided
      if (formData.password) {
        updateData.append("password", formData.password);
      }

      const response = await authAPI.updateProfile(updateData);
      updateUser(response.data);

      // Update avatar preview with new URL
      setAvatarPreview(response.data.avatar);
      
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setAvatarFile(null);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
      password: "",
      confirmPassword: "",
    });
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || "");
    setErrors({});
    setApiError("");
    setSuccess("");
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <Card>
          <div className="p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Error Message */}
            {apiError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {apiError}
              </div>
            )}

            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <User size={40} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user?.name}
                    </h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Bio
                  </h3>
                  <p className="text-gray-700">
                    {user?.bio || "No bio provided"}
                  </p>
                </div>

                {/* Edit Button */}
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Profile Picture
                  </label>

                  <div className="flex items-center space-x-4">
                    {/* Avatar Preview */}
                    {avatarPreview ? (
                      <div className="relative">
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={40} className="text-gray-500" />
                      </div>
                    )}

                    {/* Upload Button */}
                    <div>
                      <input
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("avatarInput").click()}
                      >
                        <Upload size={16} className="mr-2" />
                        {avatarPreview ? "Change" : "Upload"} Photo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG, GIF or WEBP (Max 5MB)
                      </p>
                    </div>
                  </div>

                  {errors.avatar && (
                    <p className="mt-2 text-sm text-red-500">{errors.avatar}</p>
                  )}
                </div>

                <Input
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={user?.email}
                  disabled
                />

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    maxLength={200}
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password (Optional)
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="New Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      placeholder="Leave blank to keep current password"
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;