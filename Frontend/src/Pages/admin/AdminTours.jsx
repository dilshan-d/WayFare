import React, { useEffect, useState } from 'react';
import tourService from '../../services/tourService';
import destinationService from '../../services/destinationService';
import ImageUploader from '../../components/ImageUploader';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

export const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    description: '',
    price: '',
    duration: '',
    category: 'Adventure',
    maxParticipants: 20,
    images: [],
    servicesInput: '',
    status: 'active',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tData, dData] = await Promise.all([
        tourService.getTours({ limit: 100 }),
        destinationService.getDestinations({ limit: 100 }),
      ]);
      setTours(tData.tours || []);
      setDestinations(dData.destinations || []);
    } catch (error) {
      console.error('Error fetching admin tours:', error);
      toast.error('Failed to load tours.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (tour = null) => {
    if (tour) {
      setEditingTour(tour);
      setFormData({
        name: tour.name,
        destination: tour.destination?._id || tour.destination || '',
        description: tour.description,
        price: tour.price,
        duration: tour.duration,
        category: tour.category || 'Adventure',
        maxParticipants: tour.maxParticipants || 20,
        images: tour.images || [],
        servicesInput: tour.includedServices ? tour.includedServices.join(', ') : '',
        status: tour.status || 'active',
      });
    } else {
      setEditingTour(null);
      setFormData({
        name: '',
        destination: destinations[0]?._id || '',
        description: '',
        price: '',
        duration: '',
        category: 'Adventure',
        maxParticipants: 20,
        images: [],
        servicesInput: '',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const services = formData.servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      destination: formData.destination,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      category: formData.category,
      maxParticipants: Number(formData.maxParticipants),
      images: formData.images,
      includedServices: services,
      status: formData.status,
    };

    try {
      if (editingTour) {
        await tourService.updateTour(editingTour._id, payload);
        toast.success('Tour updated!');
      } else {
        await tourService.createTour(payload);
        toast.success('Tour created!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save tour.');
    }
  };


  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await tourService.deleteTour(deleteTarget._id);
      toast.success('Tour deleted!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete tour.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Tour Package Management</h1>
          <p className="text-slate-500 text-sm">Create, edit, or remove guided tour packages.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer w-fit"
        >
          <FiPlus className="w-4 h-4" /> Create Tour
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading tour catalog..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-700">
                <tr>
                  <th className="px-6 py-4">Tour Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tours.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={t.images?.[0] || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=100&q=80'}
                        alt={t.name}
                        className="w-12 h-10 rounded-xl object-cover"
                      />
                      <span className="font-bold text-slate-900">{t.name}</span>
                    </td>
                    <td className="px-6 py-4">{t.category}</td>
                    <td className="px-6 py-4">{t.duration} Days</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(t.price)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(t)}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-xl transition"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
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
        title={editingTour ? 'Edit Tour Package' : 'Create Tour Package'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tour Name *</label>
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Nature">Nature</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price ($) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration (Days) *</label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Guests</label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description *</label>
            <textarea
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            ></textarea>
          </div>


          <ImageUploader
            multiple={true}
            currentImages={formData.images}
            onUpload={(urls) => setFormData({ ...formData, images: urls })}
            folder="tours"
            label="Tour Photos"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Included Services (Comma separated)
            </label>
            <input
              type="text"
              value={formData.servicesInput}
              onChange={(e) => setFormData({ ...formData, servicesInput: e.target.value })}
              placeholder="Guide, Hotel Transfer, Breakfast..."
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
              Save Tour
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Tour Package?"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
      />
    </div>
  );
};

export default AdminTours;
