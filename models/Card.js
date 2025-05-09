const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  username: { type: String, required: true , unique: true },
  title: { type: String },
  company: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  address: { type: String },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    github: { type: String },
    tiktok: { type: String },
  },
  profileImage: { type: String },  // URL to uploaded image (Cloudinary/Firebase)
  CoverImage: { type: String },  // URL to uploaded image (Cloudinary/Firebase)
  customLinks: [{ label: String, url: String }],
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
