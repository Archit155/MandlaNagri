const { ROLE_PERMISSIONS } = require('../config/permissions');

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires '${requiredPermission}' permission`,
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

module.exports = checkPermission;
