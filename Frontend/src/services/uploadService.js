import API from './api';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  uploadMultipleImages: async (files, folder = 'general') => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await API.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default uploadService;

