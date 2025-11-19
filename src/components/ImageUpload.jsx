import { useState } from 'react';
import { FaUpload, FaSpinner, FaImage } from 'react-icons/fa';

function ImageUpload({ currentImage, onImageChange }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400; // Max width/height
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    setUploading(true);

    try {
      // Resize image before uploading
      const resizedImage = await resizeImage(file);
      setPreview(resizedImage);
      onImageChange(resizedImage);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Lỗi khi xử lý ảnh!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {/* Preview */}
        <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700">
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <FaImage className="text-gray-600 text-3xl" />
          )}
        </div>

        {/* Upload Button */}
        <div>
          <label className="cursor-pointer">
            <div className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Đang tải lên...</span>
                </>
              ) : (
                <>
                  <FaUpload />
                  <span>Chọn ảnh</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-gray-500 text-xs mt-2">JPG, PNG hoặc GIF (tối đa 5MB)</p>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
