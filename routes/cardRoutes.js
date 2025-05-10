const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config();

const multer = require('multer');
const express = require('express');
const path = require('path');
const router = express.Router();
const {
  createCard,
  getUserCards,
  getCardById,
  getCardBUsername,
  updateCard,
  deleteCard,
} = require('../controllers/cardController');
const protect = require('../middleware/authMiddleware');



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    
    return {
      folder: 'user_cards',
      public_id: `${Date.now()}-${file.originalname}`,
      allowed_formats: ['jpg', 'jpeg', 'png'],
    };
  },
});

const upload = multer({ storage });

// Set up multer for file storage

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');  // ensure this folder exists
//     },
//     filename: function (req, file, cb) {
//       const ext = path.extname(file.originalname);
//       cb(null, Date.now() + ext);
//     },
//   });
//   const upload = multer({ storage });

// router.post('/',   upload.fields([
//     { name: 'profileImage', maxCount: 1 },
//     { name: 'CoverImage', maxCount: 1 }
//   ]), protect, createCard);

router.post(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'CoverImage', maxCount: 1 }
  ]),
  protect,
  createCard
);



router.get('/mine', protect, getUserCards);
router.get('/:id', getCardById);
router.get('/username/:username', getCardBUsername);

// router.get('/:username', getCardBUsername);
// router.get('/:param', async (req, res, next) => {
//   const { param } = req.params;

//   // Check if the param is a valid ObjectId
//   if (/^[0-9a-fA-F]{24}$/.test(param)) {
//     return getCardById(req, res, next);
//   } else {
//     return getCardBUsername(req, res, next);
//   }
// });

router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);

module.exports = router;
