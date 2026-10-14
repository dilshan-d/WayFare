import React, { useEffect, useState } from 'react';
import destinationService from '../../services/destinationService';
import ImageUploader from '../../components/ImageUploader';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

export const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    images: [],
    attractionsInput: '',
    bestTimeToVisit: '',
  });

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getDestinations({ limit: 100 });
      setDestinations(data.destinations || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to load destinations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleOpenModal = (dest = null) => {
    if (dest) {
      setEditingDest(dest);
      setFormData({
        name: dest.name,
        country: dest.country,
        description: dest.description,
        images: dest.images || [],
        attractionsInput: dest.attractions ? dest.attractions.join(', ') : '',
        bestTimeToVisit: dest.bestTimeToVisit || '',
      });
    } else {
      setEditingDest(null);
      setFormData({
        name: '',
        country: 'Sri Lanka',
        description: '',
        images: [],
        attractionsInput: '',
        bestTimeToVisit: 'Year-round',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const attractions = formData.attractionsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      country: formData.country,
      description: formData.description,
      images: formData.images,
      attractions,
      bestTimeToVisit: formData.bestTimeToVisit,
    };

    try {
      if (editingDest) {
        await destinationService.updateDestination(editingDest._id, payload);
        toast.success('Destination updated!');
      } else {
        await destinationService.createDestination(payload);
        toast.success('Destination created!');
      }
      setIsModalOpen(false);
      fetchDestinations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save destination.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await destinationService.deleteDestination(deleteTarget._id);
      toast.success('Destination deleted!');
      fetchDestinations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete destination.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Destination Management</h1>
          <p className="text-slate-500 text-sm">Add, edit, or remove travel destinations.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer w-fit"
        >
          <FiPlus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading destinations..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-700">
                <tr>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Best Time</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {destinations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={d.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80'}
                        alt={d.name}
                        className="w-12 h-10 rounded-xl object-cover"
                      />
                      <span className="font-bold text-slate-900">{d.name}</span>
                    </td>
                    <td className="px-6 py-4">{d.country}</td>
                    <td className="px-6 py-4">{d.bestTimeToVisit || 'Year-round'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(d)}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-xl transition cursor-pointer"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(d)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
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

      {/* Destination Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDest ? 'Edit Destination' : 'Add New Destination'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country *</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
            folder="destinations"
            label="Destination Photos"
          />


          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Top Attractions (Comma separated)
            </label>
            <input
              type="text"
              value={formData.attractionsInput}
              onChange={(e) => setFormData({ ...formData, attractionsInput: e.target.value })}
              placeholder="Attraction 1, Attraction 2"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Best Time To Visit</label>
            <input
              type="text"
              value={formData.bestTimeToVisit}
              onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
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
              className="px-5 py-2 text-sm font-bold text-white bg-cyan-600 rounded-xl shadow-md cursor-pointer"
            >
              Save Destination
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Destination?"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
      />
    </div>
  );
};

export default AdminDestinations;
