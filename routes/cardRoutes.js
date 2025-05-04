const multer = require('multer');
const express = require('express');
const path = require('path');
const router = express.Router();
const {
  createCard,
  getUserCards,
  getCardById,
  updateCard,
  deleteCard,
} = require('../controllers/cardController');
const protect = require('../middleware/authMiddleware');

// Set up multer for file storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // ensure this folder exists
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });
  const upload = multer({ storage });

router.post('/',   upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'CoverImage', maxCount: 1 }
  ]), protect, createCard);
router.get('/mine', protect, getUserCards);
router.get('/:id', getCardById);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);

module.exports = router;
