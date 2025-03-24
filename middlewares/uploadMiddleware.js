import supabase from "../config/db.js";  

const uploadImage = async (file, bucketName) => {
  if (!file) return null;

  const { originalname, buffer, mimetype } = file;
  const filePath = `${Date.now()}-${originalname}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, buffer, { contentType: mimetype, upsert: false });

  if (error) {
    console.error(`Supabase Storage Error in ${bucketName}:`, error);
    throw new Error(`Image upload failed in ${bucketName}`);
  }

  return supabase.storage.from(bucketName).getPublicUrl(filePath).data.publicUrl;
};

export { uploadImage };
