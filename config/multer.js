const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'images/');
    },
    filename: (req, file, cb) =>{
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    }
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Faqat rasm yuklash mumkin!'), false);
        }
    }
});

module.exports = upload;