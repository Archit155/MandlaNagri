const inviteRepository = require('../repositories/InviteRepository');
const crypto = require('crypto');

class InviteService {
  async generateInvite(role, expiresInDays = 7) {
    // Generate a random uppercase string (e.g. 8 chars)
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return inviteRepository.create({
      code,
      role,
      expiresAt
    });
  }
}

module.exports = new InviteService();
