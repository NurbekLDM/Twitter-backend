import multer from "multer";
import supabase from "../config/db.js";  // pool o'zgaruvchisini import qiling

const pool = supabase;  
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await pool.query(
      "SELECT profile_picture FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].profile_picture) {
      return res.status(404).json({ message: "Rasm topilmadi" });
    }

    const imageBuffer = result.rows[0].profile_picture;

    const base64Image = imageBuffer.toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

export default upload;