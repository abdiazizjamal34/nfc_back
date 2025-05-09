const Card = require('../models/Card');
const mongoose = require('mongoose');

// @desc    Create new card with image upload
exports.createCard = async (req, res) => {
  try {
    const { body, files, user } = req;

    const existingCard = await Card.findOne({ username: body.username });
    if (existingCard) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const cardData = {
      ...body,
      user: user._id,
      profileImage: files?.profileImage?.[0]?.path
        ? `/uploads/${files.profileImage[0].filename}`
        : undefined,
      CoverImage: files?.CoverImage?.[0]?.path
        ? `/uploads/${files.CoverImage[0].filename}`
        : undefined,
    };
    console.log("Incoming data:", cardData);
  
// console.log("Request headers:", req.headers['content-type']);
// console.log("req.body:", req.body);
// console.log("req.files:", req.files);
console.log("headers:", req.headers['content-type']);
console.log("files received:", req.files);
console.log("body:", req.body);




    const card = new Card(cardData);
    const saved = await card.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Card creation failed:", error);
    res.status(500).json({ message: "Failed to create card" });
  }
};

// @desc    Get all cards for logged-in user
exports.getUserCards = async (req, res) => {
  const cards = await Card.find({ user: req.user._id });
  res.json(cards);
};

// @desc    Get one card (for public viewing)
// exports.getCardById = async (req, res) => {
//   const card = await Card.findById(req.params.id);
//   if (!card) return res.status(404).json({ message: 'Card not found' });
//   res.json(card);
// };


exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    // Add full URL to image fields
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const response = {
      ...card.toObject(),
      profileImage: card.profileImage ? `${baseUrl}${card.profileImage}` : null,
      CoverImage: card.CoverImage ? `${baseUrl}${card.CoverImage}` : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.getCardBUsername = async (req, res) => {
//   try {
//     const card = await Card.findOne( {username :req.params.username});
//     if (!card) return res.status(404).json({ message: 'Card not found' });

//     // Add full URL to image fields
//     const baseUrl = `${req.protocol}://${req.get('host')}`;

//     const response = {
//       ...card.toObject(),
//       profileImage: card.profileImage ? `${baseUrl}${card.profileImage}` : null,
//       CoverImage: card.CoverImage ? `${baseUrl}${card.CoverImage}` : null,
//     };

//     res.json(response);
//   } catch (error) {
//     console.error("Error fetching card:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.getCardBUsername = async (req, res) => {
  try {
    // Use findOne to search by the username field
    console.log("Querying username:", req.params.username);
    // const card = await Card.findOne({ username: req.params.username });
    const card = await Card.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });

    if (!card) return res.status(404).json({ message: 'Card not found' });

    // Add full URL to image fields
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const response = {
      ...card.toObject(),
      profileImage: card.profileImage ? `${baseUrl}${card.profileImage}` : null,
      CoverImage: card.CoverImage ? `${baseUrl}${card.CoverImage}` : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ message: "Server error" });
  }
};





// @desc    Update card
// exports.updateCard = async (req, res) => {
//   const card = await Card.findById(req.params.id);
//   if (!card) return res.status(404).json({ message: 'Card not found' });

//   if (card.user.toString() !== req.user._id.toString()) {
//     return res.status(403).json({ message: 'Not authorized to update this card' });
//   }

//   Object.assign(card, req.body);
//   const updated = await card.save();
//   res.json(updated);
// };


exports.updateCard = async (req, res) => {
  try {
    console.log('Authenticated user in updateCard:', req.user); // Debug log

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid card ID' });
    }

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (card.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this card' });
    }

    Object.assign(card, req.body);
    const updated = await card.save();

    res.json(updated);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// exports.updateCard = async (req, res) => {
//   try {
//     // Validate the card ID
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).json({ message: 'Invalid card ID' });
//     }

//     const card = await Card.findById(req.params.id);
//     if (!card) {
//       return res.status(404).json({ message: 'Card not found' });
//     }

//     // Check if the user is authorized to update the card
//     if (card.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to update this card' });
//     }

//     // Update the card with the request body
//     Object.assign(card, req.body);
//     const updated = await card.save();

//     res.json(updated);
//   } catch (error) {
//     console.error('Error updating card:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// @desc    Delete card
exports.deleteCard = async (req, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).json({ message: 'Card not found' });

  if (card.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this card' });
  }

  await card.remove();
  res.json({ message: 'Card removed' });
};