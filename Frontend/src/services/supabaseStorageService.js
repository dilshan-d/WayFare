import { supabase } from '../lib/supabase';
import API from './api';

const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'wayfare-images';

/**
 * Upload an image file to Supabase Storage (with automatic API endpoint fallback).
 * @param {File} file - The file object from <input type="file">
 * @param {string} folder - Sub-folder name e.g. 'destinations', 'tours', 'hotels', 'profiles'
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadImageToSupabase = async (file, folder = 'general') => {
  if (!file) throw new Error('No file provided');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 1. Try Direct Supabase Client Upload if credentials look configured
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
    try {
      const ext = file.name.split('.').pop();
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      } else if (error) {
        console.warn('[Direct Supabase Upload Warning]:', error.message);
      }
    } catch (err) {
      console.warn('[Direct Supabase Upload Exception]:', err.message);
    }
  }

  // 2. Fallback: Upload via Backend API Route (/api/upload) using configured API client
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data?.url) {
      return response.data.url;
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error('[API Upload Error]:', msg);
    if (err.response?.status === 401) {
      throw new Error('Your session has expired. Please log out and log in again as Admin.');
    }
    throw new Error(msg || 'Failed to upload image via API fallback.');
  }

  throw new Error('Image upload failed. Please check your Supabase bucket configuration or re-login.');
};

/**
 * Upload multiple image files to Supabase Storage (with automatic API endpoint fallback).
 * @param {Array<File>} files - Array of File objects from <input type="file" multiple>
 * @param {string} folder - Sub-folder name e.g. 'destinations', 'tours', 'hotels', 'profiles'
 * @returns {Promise<Array<string>>} - Array of public URLs of uploaded images
 */
export const uploadMultipleImagesToSupabase = async (files, folder = 'general') => {
  if (!files || files.length === 0) return [];

  const fileArray = Array.from(files);

  // Try direct concurrent Supabase uploads for each file
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
    try {
      const urls = await Promise.all(
        fileArray.map((file) => uploadImageToSupabase(file, folder))
      );
      return urls;
    } catch (err) {
      console.warn('[Direct Supabase Multiple Upload Warning, trying API fallback]:', err.message);
    }
  }

  // Fallback: Batch API upload via /api/upload/multiple
  try {
    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await API.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data?.urls) {
      return response.data.urls;
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error('[API Multiple Upload Error]:', msg);
    if (err.response?.status === 401) {
      throw new Error('Your session has expired. Please log out and log in again as Admin.');
    }
    throw new Error(msg || 'Failed to upload multiple images via API fallback.');
  }

  throw new Error('Multiple image upload failed. Check bucket configuration.');
};

export default uploadImageToSupabase;

