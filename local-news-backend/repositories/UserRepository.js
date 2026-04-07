const User = require('../models/User');

class UserRepository {
  async findByEmail(email, includePassword = false) {
    let query = User.findOne({ email });
    if (includePassword) {
      query = query.select('+password');
    }
    return query;
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(userData) {
    return User.create(userData);
  }

  async updateRefreshTokens(userId, tokens) {
    return User.findByIdAndUpdate(userId, { refreshTokens: tokens }, { returnDocument: 'after' });
  }

  async removeRefreshToken(userId, token) {
    return User.findByIdAndUpdate(userId, { $pull: { refreshTokens: token } });
  }
  
  async findByRefreshToken(token) {
    return User.findOne({ refreshTokens: token });
  }
}

module.exports = new UserRepository();
