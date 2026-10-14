import React, { useEffect, useState } from 'react';
import reviewService from '../../services/reviewService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';
import { FiStar, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviews();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching admin reviews:', error);
      toast.error('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (review) => {
    const newStatus = review.status === 'approved' ? 'pending' : 'approved';
    try {
      await reviewService.updateReview(review._id, { status: newStatus });
      toast.success(`Review set to ${newStatus}`);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update review status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await reviewService.deleteReview(deleteTarget._id);
      toast.success('Review deleted successfully.');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Review Moderation</h1>
        <p className="text-slate-500 text-sm">Approve, reject, or remove customer feedback and ratings.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading customer feedback..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-700">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Target Type</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 font-bold text-cyan-600">{r.targetType}</td>
                    <td className="px-6 py-4 font-bold text-amber-500 flex items-center gap-1">
                      <FiStar className="fill-amber-400" /> {r.rating}.0
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">{r.comment}</td>
                    <td className="px-6 py-4">{formatDate(r.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(r)}
                        className={`p-2 rounded-xl transition ${
                          r.status === 'approved'
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={r.status === 'approved' ? 'Set Pending' : 'Approve'}
                      >
                        {r.status === 'approved' ? <FiXCircle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Delete Review"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Review?"
        message="Are you sure you want to permanently delete this customer review?"
      />
    </div>
  );
};

export default AdminReviews;
