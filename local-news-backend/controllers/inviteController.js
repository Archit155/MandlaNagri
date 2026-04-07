const inviteService = require('../services/InviteService');

exports.createInvite = async (req, res, next) => {
  try {
    const { role, expiresInDays } = req.body;
    
    // Only admin can create invites, handled by permissions middleware

    const invite = await inviteService.generateInvite(role || 'employee', expiresInDays);

    res.status(201).json({
      success: true,
      data: invite
    });
  } catch (err) {
    next(err);
  }
};
