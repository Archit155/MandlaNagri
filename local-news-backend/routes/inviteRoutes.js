const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');
const { protect } = require('../middleware/authMiddleware'); // we will create authMiddleware referencing cookies/tokens
const checkPermission = require('../middleware/permissionsMiddleware');
const { PERMISSIONS } = require('../config/permissions');

router.post(
  '/',
  protect,
  checkPermission(PERMISSIONS.GENERATE_INVITE),
  inviteController.createInvite
);

module.exports = router;
