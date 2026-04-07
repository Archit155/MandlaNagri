const Invite = require('../models/Invite');

class InviteRepository {
  async findByCode(code) {
    return Invite.findOne({ code });
  }

  async create(inviteData) {
    return Invite.create(inviteData);
  }

  async markAsUsed(id, userId) {
    return Invite.findByIdAndUpdate(id, { used: true, usedBy: userId }, { new: true });
  }
}

module.exports = new InviteRepository();
