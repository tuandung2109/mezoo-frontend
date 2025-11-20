import { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/reviewService';
import Toast from './Toast';

function Reviews({ movieId }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated) {
      fetchUserReview();
    }
  }, [movieId, sortBy, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getMovieReviews(movieId, { sort: sortBy });
      setReviews(response.data.reviews || []);
      setAverageRating(response.data.averageRating || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await reviewService.getUserReview(movieId);
      setUserReview(response.data || null);
    } catch (error) {
      console.error('Error fetching user review:', error);
      setUserReview(null);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá', 'error');
      return;
    }

    try {
      if (editingReview) {
        // Update existing review
        await reviewService.updateReview(editingReview._id, formData);
        showToast('Đã cập nhật đánh giá!');
      } else {
        // Create new review
        await reviewService.createReview(movieId, formData);
        showToast('Đã thêm đánh giá!');
      }

      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      setEditingReview(null);
      fetchReviews();
      fetchUserReview();
    } catch (error) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment
    });
    setShowForm(true);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
      await reviewService.deleteReview(reviewId);
      showToast('Đã xóa đánh giá');
      fetchReviews();
      fetchUserReview();
    } catch (error) {
      showToast('Không thể xóa đánh giá', 'error');
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập', 'error');
      return;
    }

    try {
      await reviewService.toggleHelpful(reviewId);
      fetchReviews();
    } catch (error) {
      showToast('Có lỗi xảy ra', 'error');
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition`}
            disabled={!interactive}
          >
            <FaStar
              className={star <= rating ? 'text-yellow-400' : 'text-gray-600'}
              size={interactive ? 24 : 16}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Đánh giá & Bình luận</h2>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-xl font-bold">{averageRating}</span>
              <span className="text-gray-400">({reviews.length} đánh giá)</span>
            </div>
          </div>
        </div>

        {isAuthenticated && !userReview && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-netflix-red px-6 py-2 rounded hover:bg-red-700 transition font-semibold"
          >
            {showForm ? 'Hủy' : 'Viết đánh giá'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Đánh giá của bạn</label>
            {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Nhận xét</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-netflix-red resize-none"
              rows="4"
              placeholder="Chia sẻ suy nghĩ của bạn về bộ phim..."
              maxLength="1000"
            />
            <p className="text-xs text-gray-400 mt-1">{formData.comment.length}/1000</p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-netflix-red px-6 py-2 rounded hover:bg-red-700 transition font-semibold"
            >
              {editingReview ? 'Cập nhật' : 'Gửi đánh giá'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingReview(null);
                setFormData({ rating: 5, comment: '' });
              }}
              className="bg-gray-700 px-6 py-2 rounded hover:bg-gray-600 transition font-semibold"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Sort Options */}
      <div className="flex space-x-3">
        {['newest', 'oldest', 'helpful'].map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-4 py-2 rounded-lg transition ${
              sortBy === sort
                ? 'bg-netflix-red text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {sort === 'newest' && 'Mới nhất'}
            {sort === 'oldest' && 'Cũ nhất'}
            {sort === 'helpful' && 'Hữu ích nhất'}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 py-8">Đang tải...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Chưa có đánh giá nào</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-netflix-red rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {review.user.avatar ? (
                      <img src={review.user.avatar} alt={review.user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold">
                        {review.user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">{review.user.fullName || review.user.username}</h4>
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      {review.isEdited && (
                        <span className="text-xs text-gray-500">(đã chỉnh sửa)</span>
                      )}
                    </div>
                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>

                    <div className="flex items-center space-x-4 mt-3">
                      <button
                        onClick={() => handleHelpful(review._id)}
                        className={`flex items-center space-x-2 text-sm transition ${
                          review.helpful.includes(user?._id)
                            ? 'text-netflix-red'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <FaThumbsUp />
                        <span>Hữu ích ({review.helpful.length})</span>
                      </button>
                    </div>
                  </div>
                </div>

                {user && review.user._id === user._id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-gray-400 hover:text-white transition"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Reviews;
