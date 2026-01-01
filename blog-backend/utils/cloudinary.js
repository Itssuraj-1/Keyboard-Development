// blog-backend/utils/cloudinary.js - DEVELOPMENT VERSION WITH LOCAL FALLBACK
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary (will fail gracefully if not configured)
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== "demo";

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary configured");
} else {
  console.log("⚠️  Cloudinary not configured - using local file storage");
  console.log(
    "📝 To use Cloudinary: Get credentials from https://cloudinary.com"
  );
}

// Create uploads directory for local storage
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory:", uploadsDir);
}

/**
 * Upload image to Cloudinary OR save locally in development
 * @param {Buffer} file - File buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Upload result
 */
export const uploadToCloudinary = async (file, folder = "blog-covers") => {
  try {
    // Try Cloudinary first if configured
    if (isCloudinaryConfigured) {
      const base64 = `data:image/jpeg;base64,${file.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder,
        resource_type: "auto",
        transformation: [
          { width: 1200, height: 630, crop: "fill", quality: "auto" },
        ],
      });

      console.log("✅ Uploaded to Cloudinary:", result.public_id);

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    // Fallback: Save locally in development
    console.log("💾 Saving file locally (development mode)");

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.jpg`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, file);

    // Return local URL
    const localUrl = `http://localhost:${
      process.env.PORT || 5001
    }/uploads/${fileName}`;

    console.log("✅ Saved locally:", localUrl);

    return {
      url: localUrl,
      publicId: fileName,
    };
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary OR local storage
 * @param {String} publicId - Public ID of the image or filename
 * @returns {Promise<Object>} - Delete result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    // Try Cloudinary first if configured
    if (isCloudinaryConfigured && publicId.includes("/")) {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("🗑️  Deleted from Cloudinary:", publicId);
      return result;
    }

    // Fallback: Delete from local storage
    const filePath = path.join(uploadsDir, publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🗑️  Deleted locally:", publicId);
      return { result: "ok" };
    }

    console.log("⚠️  File not found:", publicId);
    return { result: "not found" };
  } catch (error) {
    console.error("❌ Delete error:", error.message);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

export default cloudinary;
