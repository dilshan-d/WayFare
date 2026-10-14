import express from 'express';
import fs from 'fs';
import { upload } from '../Middlwares/uploadMiddleware.js';
import { protect } from '../Middlwares/authentication.js';
import { uploadFileToSupabase } from '../services/supabaseService.js';

const router = express.Router();

// @desc    Upload image file to Supabase Storage (or fallback to local disk)
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    // Attempt Supabase Storage Upload
    const fileBuffer = fs.readFileSync(req.file.path);
    const supabaseUrl = await uploadFileToSupabase(
      fileBuffer,
      req.file.originalname,
      req.file.mimetype,
      req.body.folder || 'general'
    );

    if (supabaseUrl) {
      // Successfully uploaded to Supabase Storage; remove local temporary file
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        // ignore cleanup error
      }

      return res.json({
        url: supabaseUrl,
        filename: req.file.filename,
        storage: 'supabase',
      });
    }
  } catch (err) {
    console.warn('[Upload Route] Supabase upload bypassed, using local storage:', err.message);
  }

  // Fallback: Local Server URL
  const protocol = req.protocol;
  const host = req.get('host');
  const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;
  const fullUrl = `${protocol}://${host}${imagePath}`;

  res.json({
    url: fullUrl,
    filename: req.file.filename,
    path: imagePath,
    storage: 'local',
  });
});

// @desc    Upload multiple image files to Supabase Storage (or fallback to local disk)
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No image files uploaded' });
  }

  const folder = req.body.folder || 'general';
  const protocol = req.protocol;
  const host = req.get('host');

  const uploadPromises = req.files.map(async (file) => {
    let finalUrl = '';
    let storageType = 'local';

    try {
      const fileBuffer = fs.readFileSync(file.path);
      const supabaseUrl = await uploadFileToSupabase(
        fileBuffer,
        file.originalname,
        file.mimetype,
        folder
      );

      if (supabaseUrl) {
        finalUrl = supabaseUrl;
        storageType = 'supabase';
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          // ignore
        }
      }
    } catch (err) {
      console.warn(`[Upload Route Multiple] Supabase error for ${file.originalname}:`, err.message);
    }

    if (!finalUrl) {
      const imagePath = `/${file.path.replace(/\\/g, '/')}`;
      finalUrl = `${protocol}://${host}${imagePath}`;
    }

    return {
      url: finalUrl,
      filename: file.filename,
      originalname: file.originalname,
      storage: storageType,
    };
  });

  try {
    const results = await Promise.all(uploadPromises);
    const urls = results.map((r) => r.url);
    res.json({
      urls,
      files: results,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload multiple images', error: err.message });
  }
});

export default router;

