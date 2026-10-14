import React from 'react';
import { FiStar } from 'react-icons/fi';
import { formatDate } from '../utils/formatters';

export const ReviewCard = ({ review }) => {
  if (!review) return null;

  const userName = review.user
    ? `${review.user.firstName} ${review.user.lastName}`
    : 'Verified Traveler';
  const userAvatar =
    review.user?.profileImage ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <FiStar
            key={idx}
            className={`w-4 h-4 ${
              idx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
            }`}
          />
        ))}
        <span className="ml-2 text-xs font-bold text-slate-700">{review.rating}.0</span>
      </div>

      {/* Quote */}
      <p className="text-slate-600 text-sm leading-relaxed italic">"{review.comment}"</p>

      {/* User Info */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <img
          src={userAvatar}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover border border-slate-200"
        />
        <div>
          <h5 className="text-sm font-bold text-slate-900">{userName}</h5>
          <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
