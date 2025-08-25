const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Neispravan email ili lozinka' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};