import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'wayfare-images';

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase Storage Service] Initialized successfully');
  } catch (err) {
    console.warn('[Supabase Storage Service] Failed to initialize client:', err.message);
  }
} else {
  console.warn('[Supabase Storage Service] Credentials missing in environment; fallback to local storage enabled.');
}

/**
 * Ensure Supabase Bucket exists
 */
const ensureBucketExists = async () => {
  if (!supabase) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET, { public: true });
      console.log(`[Supabase Storage] Created public bucket: ${BUCKET}`);
    }
  } catch (err) {
    console.warn(`[Supabase Storage] Bucket check/create info:`, err.message);
  }
};

/**
 * Upload buffer or file to Supabase Storage
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimeType
 * @param {string} folder
 * @returns {Promise<string|null>} Public URL or null if fallback required
 */
export const uploadFileToSupabase = async (fileBuffer, originalName, mimeType, folder = 'uploads') => {
  if (!supabase) return null;

  try {
    await ensureBucketExists();

    const ext = path.extname(originalName) || '.jpg';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;

    let { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error && error.message?.toLowerCase().includes('bucket not found')) {
      // Retry once after creating bucket
      await supabase.storage.createBucket(BUCKET, { public: true });
      const retryResult = await supabase.storage
        .from(BUCKET)
        .upload(filename, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      console.error('[Supabase Storage Error]:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error('[Supabase Storage Exception]:', err.message);
    return null;
  }
};

export default supabase;
