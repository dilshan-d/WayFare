import React, { useEffect, useState } from 'react';
import roomService from '../../services/roomService';
import hotelService from '../../services/hotelService';
import ImageUploader from '../../components/ImageUploader';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

export const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    hotel: '',
    roomType: 'Deluxe',
    description: '',
    capacity: 2,
    pricePerNight: 150,
    amenitiesInput: 'King Bed, Air Conditioning, Free WiFi',
    images: [],
    availability: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rData, hData] = await Promise.all([
        roomService.getRooms(),
        hotelService.getHotels({ limit: 100 }),
      ]);
      setRooms(rData || []);
      setHotels(hData.hotels || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        hotel: room.hotel?._id || room.hotel || '',
        roomType: room.roomType || 'Deluxe',
        description: room.description || '',
        capacity: room.capacity || 2,
        pricePerNight: room.pricePerNight || 150,
        amenitiesInput: room.amenities ? room.amenities.join(', ') : '',
        images: room.images || [],
        availability: room.availability !== undefined ? room.availability : true,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        hotel: hotels[0]?._id || '',
        roomType: 'Deluxe',
        description: '',
        capacity: 2,
        pricePerNight: 150,
        amenitiesInput: 'King Bed, Air Conditioning, Free WiFi, TV',
        images: [],
        availability: true,
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
      hotel: formData.hotel,
      roomType: formData.roomType,
      description: formData.description,
      capacity: Number(formData.capacity),
      pricePerNight: Number(formData.pricePerNight),
      amenities,
      images: formData.images,
      availability: formData.availability,
    };

    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom._id, payload);
        toast.success('Room updated!');
      } else {
        await roomService.createRoom(payload);
        toast.success('Room created!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room.');
    }
  };


  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await roomService.deleteRoom(deleteTarget._id);
      toast.success('Room deleted!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete room.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Room Inventory Management</h1>
          <p className="text-slate-500 text-sm">Add, edit, or set availability for hotel rooms.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer w-fit"
        >
          <FiPlus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading room inventory..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-700">
                <tr>
                  <th className="px-6 py-4">Hotel</th>
                  <th className="px-6 py-4">Room Type</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Rate / Night</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {rooms.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{r.hotel?.name || 'Hotel'}</td>
                    <td className="px-6 py-4">{r.roomType} Suite</td>
                    <td className="px-6 py-4">{r.capacity} Guests</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(r.pricePerNight)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          r.availability ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.availability ? 'Available' : 'Booked / Off'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(r)}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-xl transition"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r)}
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
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hotel *</label>
            <select
              required
              value={formData.hotel}
              onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              <option value="">Select Hotel</option>
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room Type</label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Family Suite">Family Suite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capacity</label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price / Night ($)</label>
              <input
                type="number"
                required
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            ></textarea>
          </div>


          <ImageUploader
            multiple={true}
            currentImages={formData.images}
            onUpload={(urls) => setFormData({ ...formData, images: urls })}
            folder="rooms"
            label="Room Photos"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Amenities (Comma separated)
            </label>
            <input
              type="text"
              value={formData.amenitiesInput}
              onChange={(e) => setFormData({ ...formData, amenitiesInput: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="availCheck"
              checked={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
            />
            <label htmlFor="availCheck" className="text-xs font-bold text-slate-700">Available for Booking</label>
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
              Save Room
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Room?"
        message="Are you sure you want to remove this room from inventory?"
      />
    </div>
  );
};

export default AdminRooms;
