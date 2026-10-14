import React, { useEffect, useState } from 'react';
import hotelService from '../../services/hotelService';
import destinationService from '../../services/destinationService';
import ImageUploader from '../../components/ImageUploader';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

export const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    location: '',
    address: '',
    description: '',
    startingPrice: 100,
    rating: 4.5,
    images: [],
    amenitiesInput: '',
    status: 'active',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hData, dData] = await Promise.all([
        hotelService.getHotels({ limit: 100 }),
        destinationService.getDestinations({ limit: 100 }),
      ]);
      setHotels(hData.hotels || []);
      setDestinations(dData.destinations || []);
    } catch (error) {
      console.error('Error fetching admin hotels:', error);
      toast.error('Failed to load hotels.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name,
        destination: hotel.destination?._id || hotel.destination || '',
        location: hotel.location,
        address: hotel.address || '',
        description: hotel.description || '',
        startingPrice: hotel.startingPrice || 100,
        rating: hotel.rating || 4.5,
        images: hotel.images || [],
        amenitiesInput: hotel.amenities ? hotel.amenities.join(', ') : '',
        status: hotel.status || 'active',
      });
    } else {
      setEditingHotel(null);
      setFormData({
        name: '',
        destination: destinations[0]?._id || '',
        location: '',
        address: '',
        description: '',
        startingPrice: 100,
        rating: 4.5,
        images: [],
        amenitiesInput: 'Free WiFi, Pool, Spa, Restaurant',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amenities = formData.amenitiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      destination: formData.destination,
      location: formData.location,
      address: formData.address,
      description: formData.description,
      startingPrice: Number(formData.startingPrice),
      rating: Number(formData.rating),
      images: formData.images,
      amenities,
      status: formData.status,
    };

    try {
      if (editingHotel) {
        await hotelService.updateHotel(editingHotel._id, payload);
        toast.success('Hotel updated!');
      } else {
        await hotelService.createHotel(payload);
        toast.success('Hotel created!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save hotel.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await hotelService.deleteHotel(deleteTarget._id);
      toast.success('Hotel deleted!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete hotel.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Hotel Management</h1>
          <p className="text-slate-500 text-sm">Manage hotels, locations, amenities, and starting prices.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer w-fit"
        >
          <FiPlus className="w-4 h-4" /> Add Hotel
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading hotel directory..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-700">
                <tr>
                  <th className="px-6 py-4">Hotel Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Starting Rate</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {hotels.map((h) => (
                  <tr key={h._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={h.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80'}
                        alt={h.name}
                        className="w-12 h-10 rounded-xl object-cover"
                      />
                      <span className="font-bold text-slate-900">{h.name}</span>
                    </td>
                    <td className="px-6 py-4">{h.location}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(h.startingPrice)}</td>
                    <td className="px-6 py-4 font-bold text-amber-500">{h.rating || 4.5} ★</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          h.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(h)}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-xl transition"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(h)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hotel Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination *</label>
              <select
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="">Select Destination</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Ella, Sri Lanka"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Starting Rate ($)</label>
              <input
                type="number"
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            ></textarea>
          </div>

          <ImageUploader
            multiple={true}
            currentImages={formData.images}
            onUpload={(urls) => setFormData({ ...formData, images: urls })}
            folder="hotels"
            label="Hotel Photos"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Amenities (Comma separated)
            </label>
            <input
              type="text"
              value={formData.amenitiesInput}
              onChange={(e) => setFormData({ ...formData, amenitiesInput: e.target.value })}
              placeholder="Free WiFi, Pool, Spa"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-cyan-600 rounded-xl shadow-md"
            >
              Save Hotel
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Hotel?"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
      />
    </div>
  );
};

export default AdminHotels;
