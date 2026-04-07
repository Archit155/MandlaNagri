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
      let err = new Error('Password must be strong (8+ chars, uppercase, lowercase, number, special character)');
      err.statusCode = 400; // Using statusCode for global error handler compatibility
      throw err;
    }

    let assignedRole = 'user'; 

    if (role === 'employee' || role === 'admin') {
      if (!inviteCode) {
        let err = new Error('Invite code is required for elevated roles');
        err.code = 'INVITE_REQUIRED';
        throw err;
      }
      const invite = await inviteRepository.findByCode(inviteCode.toUpperCase());
      if (!invite || !invite.isValid()) {
        let err = new Error('Invalid or expired invite code');
        err.code = 'INVALID_INVITE';
        throw err;
      }
      assignedRole = invite.role; // trust invite role over requested role
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      let err = new Error('Email already exists');
      err.code = 'DUPLICATE_EMAIL';
      throw err;
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
      let err = new Error('Incorrect email or password');
      err.code = 'UNAUTHORIZED';
      throw err;
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
      // Token reuse detection could go here (if user not found but token exists in a separate collection, or if we decode and clear all tokens to be safe)
      let err = new Error('Invalid refresh token');
      err.code = 'INVALID_REFRESH';
      throw err;
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
