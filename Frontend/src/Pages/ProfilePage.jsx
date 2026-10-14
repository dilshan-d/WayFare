import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiGlobe, FiLock, FiSave } from 'react-icons/fi';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    profileImage: user?.profileImage || '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        profileImage: formData.profileImage,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const updated = await userService.updateUser(user._id, payload);
      updateUserProfile(updated);
      toast.success('Profile updated successfully!');
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8 text-left">
        <div className="text-center max-w-md mx-auto space-y-2">
          <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block">
            Account Management
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">User Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 border-b border-slate-100 pb-6">
            <img
              src={formData.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={formData.firstName}
              className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500 shadow-md"
            />
            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-bold text-slate-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-xs text-slate-400 capitalize">Role: {user?.role || 'Customer'}</p>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="Profile Image URL"
                className="w-full mt-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                First Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <div className="relative">
              <FiGlobe className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Change Password (Optional)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep unchanged"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : <><FiSave /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
