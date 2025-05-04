const Card = require('../models/Card');

// @desc    Create new card with image upload
exports.createCard = async (req, res) => {
  try {
    const { body, files, user } = req;

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
exports.getCardById = async (req, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).json({ message: 'Card not found' });
  res.json(card);
};

// @desc    Update card
exports.updateCard = async (req, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).json({ message: 'Card not found' });

  if (card.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this card' });
  }

  Object.assign(card, req.body);
  const updated = await card.save();
  res.json(updated);
};

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