const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fb8d87ac2959c5d1bcdad7e6a4579c88a846c59c58525b6c7f890a5d4e3f2c1b'
    );

    // Attach user with decoded role (no extra DB lookup needed for role)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Attach both user doc and decoded role to req
    req.user = { ...user.toObject(), id: user._id.toString(), role: decoded.role || user.role };

    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed or expired',
      code: 'TOKEN_INVALID'
    });
  }
};
