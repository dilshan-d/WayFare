import React, { useRef, useState, useEffect } from 'react';
import { FiUploadCloud, FiX, FiPlus, FiImage, FiCheckCircle } from 'react-icons/fi';
import { uploadImageToSupabase, uploadMultipleImagesToSupabase } from '../services/supabaseStorageService';
import toast from 'react-hot-toast';

/**
 * Reusable Supabase Image Uploader Component
 * Supports both single image upload and multiple simultaneous image uploads.
 *
 * Props:
 *   - multiple: boolean (default false)
 *   - currentImage: string (existing image URL for single mode)
 *   - currentImages: Array<string> (existing image URLs for multiple mode)
 *   - onUpload: function(url | urls)
 *   - onMultipleUpload: function(urls)
 *   - folder: string e.g. 'destinations', 'tours', 'hotels', 'rooms', 'profiles'
 *   - label: string
 */
export const ImageUploader = ({
  multiple = false,
  currentImage,
  currentImages = [],
  onUpload,
  onMultipleUpload,
  folder = 'general',
  label,
}) => {
  const inputRef = useRef(null);

  // Normalization for multiple vs single
  const isMultiple = multiple || Array.isArray(currentImages) && currentImages.length > 0;
  
  const [singlePreview, setSinglePreview] = useState(currentImage || '');
  const [multiPreviews, setMultiPreviews] = useState(currentImages || []);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    if (isMultiple) {
      setMultiPreviews(currentImages || []);
    } else {
      setSinglePreview(currentImage || '');
    }
  }, [currentImage, currentImages, isMultiple]);

  const validateFiles = (files) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const valid = [];

    for (const file of files) {
      if (!allowed.includes(file.type)) {
        toast.error(`"${file.name}" is invalid. Only JPG, PNG, WebP, and GIF supported.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB limit.`);
        continue;
      }
      valid.push(file);
    }
    return valid;
  };

  // --- Handle Single File ---
  const handleSingleFile = async (file) => {
    if (!file) return;
    const [valid] = validateFiles([file]);
    if (!valid) return;

    const localPreview = URL.createObjectURL(valid);
    setSinglePreview(localPreview);

    try {
      setUploading(true);
      setUploadProgress('Uploading image...');
      const publicUrl = await uploadImageToSupabase(valid, folder);
      setSinglePreview(publicUrl);
      if (onUpload) onUpload(publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Image upload failed.');
      setSinglePreview(currentImage || '');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  // --- Handle Multiple Files ---
  const handleMultipleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    // Local blob preview placeholders
    const localBlobs = validFiles.map((f) => URL.createObjectURL(f));
    const updatedPreviews = [...multiPreviews, ...localBlobs];
    setMultiPreviews(updatedPreviews);

    try {
      setUploading(true);
      setUploadProgress(`Uploading ${validFiles.length} image(s)...`);

      const uploadedUrls = await uploadMultipleImagesToSupabase(validFiles, folder);

      // Replace local blobs with real uploaded URLs
      const finalUrls = [...multiPreviews, ...uploadedUrls];
      setMultiPreviews(finalUrls);

      if (onMultipleUpload) onMultipleUpload(finalUrls);
      if (onUpload) onUpload(finalUrls);

      toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
    } catch (err) {
      toast.error(err.message || 'Multiple upload failed.');
      // Revert local blobs on failure
      setMultiPreviews(multiPreviews);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (isMultiple) {
      handleMultipleFiles(files);
    } else {
      handleSingleFile(files[0]);
    }
    // reset input
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    if (isMultiple) {
      handleMultipleFiles(files);
    } else {
      handleSingleFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClearSingle = (e) => {
    e.stopPropagation();
    setSinglePreview('');
    if (onUpload) onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemoveMultipleIndex = (indexToRemove, e) => {
    e.stopPropagation();
    const updated = multiPreviews.filter((_, idx) => idx !== indexToRemove);
    setMultiPreviews(updated);
    if (onMultipleUpload) onMultipleUpload(updated);
    if (onUpload) onUpload(updated);
  };

  const defaultLabel = isMultiple ? 'Photos (Multiple Upload)' : 'Cover Image';

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label || defaultLabel}
        </label>
        {isMultiple && multiPreviews.length > 0 && (
          <span className="text-xs text-cyan-700 font-semibold">
            {multiPreviews.length} photo{multiPreviews.length > 1 ? 's' : ''} uploaded
          </span>
        )}
      </div>

      {/* MULTIPLE IMAGES MODE */}
      {isMultiple ? (
        <div className="space-y-3">
          {/* Grid Preview of Uploaded Images */}
          {multiPreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 bg-slate-100/60 rounded-2xl border border-slate-200/80">
              {multiPreviews.map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-900/5">
                  <img
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* Badge for cover / index */}
                  <span className="absolute top-1 left-1 bg-slate-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                    {idx === 0 ? 'Cover' : `#${idx + 1}`}
                  </span>
                  {/* Overlay Delete */}
                  {!uploading && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveMultipleIndex(idx, e)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow transition cursor-pointer"
                      title="Remove image"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Dropzone Button */}
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative w-full py-4 px-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center text-center
              ${isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-cyan-400 bg-slate-50 hover:bg-cyan-50/40'}
              ${uploading ? 'cursor-wait opacity-70' : ''}
            `}
          >
            {uploading ? (
              <div className="flex items-center gap-3 py-1">
                <div className="w-6 h-6 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-cyan-700">{uploadProgress}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 group-hover:text-cyan-700 transition">
                <div className="w-8 h-8 rounded-xl bg-slate-200 group-hover:bg-cyan-100 flex items-center justify-center transition">
                  <FiUploadCloud className="w-4 h-4 text-slate-500 group-hover:text-cyan-600" />
                </div>
                <div className="text-xs font-semibold">
                  {multiPreviews.length > 0 ? (
                    <span>Click or drag to <strong className="text-cyan-600">add more images</strong></span>
                  ) : (
                    <span>Click or drag & drop <strong className="text-cyan-600">multiple images</strong> here</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SINGLE IMAGE MODE */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group
            ${isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-cyan-400 bg-slate-50 hover:bg-cyan-50/40'}
            ${uploading ? 'cursor-wait pointer-events-none opacity-70' : ''}
          `}
          style={{ minHeight: singlePreview ? '0' : '110px' }}
        >
          {singlePreview ? (
            /* Single Image Preview */
            <div className="relative">
              <img
                src={singlePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg">
                  <FiUploadCloud className="w-4 h-4" /> Click or drag to replace
                </span>
              </div>

              {!uploading && (
                <button
                  type="button"
                  onClick={handleClearSingle}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md z-10 transition cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            /* Empty State Single */
            <div className="flex flex-col items-center justify-center py-7 px-4 text-center">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 group-hover:bg-cyan-100 flex items-center justify-center mb-2 transition">
                <FiUploadCloud className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition" />
              </div>
              <p className="text-xs font-semibold text-slate-600 group-hover:text-cyan-700 transition">
                Click or drag & drop image here
              </p>
              <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WebP, GIF — Max 5MB</p>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20 rounded-xl">
              <div className="flex flex-col items-center gap-2">
                <div className="w-7 h-7 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-cyan-700">{uploadProgress || 'Uploading...'}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        multiple={isMultiple}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
