const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');
const inviteRepository = require('../repositories/InviteRepository');
const ROLES = require('../config/roles'); // I'll create this or use existing

class AuthService {
  generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id }, 
      process.env.REFRESH_TOKEN_SECRET, 
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  async signup(data) {
    let { name, email, password, role, inviteCode } = data;
    
    // Strong password validation regex
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      throw new AppError('Password must be strong (8+ chars, uppercase, lowercase, number, special character)', 400);
    }

    let assignedRole = 'user'; 

    if (role === 'employee' || role === 'admin') {
      if (!inviteCode) {
        throw new AppError('Invite code is required for elevated roles', 400);
      }
      const invite = await inviteRepository.findByCode(inviteCode.toUpperCase());
      if (!invite || !invite.isValid()) {
        throw new AppError('Invalid or expired invite code', 400);
      }
      assignedRole = invite.role; // trust invite role over requested role
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already exists', 400);
    }

    const user = await userRepository.create({ name, email, password, role: assignedRole });

    if (inviteCode) {
      const invite = await inviteRepository.findByCode(inviteCode.toUpperCase());
      if (invite) await inviteRepository.markAsUsed(invite._id, user._id);
    }

    const tokens = this.generateTokens(user);
    await userRepository.updateRefreshTokens(user._id, [...user.refreshTokens, tokens.refreshToken]);

    return { user, ...tokens };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const tokens = this.generateTokens(user);
    // Add new refresh token to array
    await userRepository.updateRefreshTokens(user._id, [...user.refreshTokens, tokens.refreshToken]);

    return { user, ...tokens };
  }

  async refreshToken(token) {
    if (!token) throw new Error('No refresh token provided');

    const user = await userRepository.findByRefreshToken(token);
    if (!user) {
      throw new AppError('Invalid refresh token', 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      
      const newTokens = this.generateTokens(user);
      
      // Remove old token, add new one (token rotation)
      const updatedTokens = user.refreshTokens.filter(t => t !== token);
      updatedTokens.push(newTokens.refreshToken);
      await userRepository.updateRefreshTokens(user._id, updatedTokens);

      return newTokens;
    } catch (err) {
      // Token expired or invalid
      await userRepository.removeRefreshToken(user._id, token);
      err.code = 'INVALID_REFRESH';
      throw err;
    }
  }

  async logout(userId, token) {
    await userRepository.removeRefreshToken(userId, token);
  }
}

module.exports = new AuthService();
