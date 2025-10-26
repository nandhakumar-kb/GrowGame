import React, { useState } from 'react';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store feedback in localStorage
    const feedbackData = {
      rating,
      feedback,
      email,
      timestamp: new Date().toISOString(),
    };
    
    const existingFeedback = JSON.parse(localStorage.getItem('growgame-feedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('growgame-feedback', JSON.stringify(existingFeedback));
    
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setFeedback('');
    setEmail('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full border-4 border-purple-500 shadow-2xl shadow-purple-500/50 transform animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">💬</span>
            Feedback
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2 text-3xl leading-none"
            aria-label="Close feedback modal"
          >
            ×
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-gray-300">Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-3 text-lg">
                Rate Your Experience
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 text-5xl"
                    aria-label={`Rate ${star} stars`}
                  >
                    {star <= (hoverRating || rating) ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-purple-400 mt-2 font-semibold">
                  {rating === 5 && "Amazing! 🌟"}
                  {rating === 4 && "Great! 😊"}
                  {rating === 3 && "Good! 👍"}
                  {rating === 2 && "Okay 😐"}
                  {rating === 1 && "Not Great 😞"}
                </p>
              )}
            </div>

            {/* Feedback Text */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-2" htmlFor="feedback-text">
                Your Feedback
              </label>
              <textarea
                id="feedback-text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think about GrowGame..."
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none transition-colors"
                rows="4"
                required
              />
            </div>

            {/* Email (Optional) */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-2" htmlFor="feedback-email">
                Email (Optional)
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0 || !feedback.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
