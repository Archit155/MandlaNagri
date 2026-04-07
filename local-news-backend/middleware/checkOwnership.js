const Article = require('../models/Article');
const { ROLES } = require('../config/permissions');

const checkOwnership = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Admins bypass ownership check
    if (req.user.role === ROLES.ADMIN) {
      req.resource = article; // attach to req for controller use if needed
      return next();
    }

    // Check if current user is the author
    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this resource',
        code: 'FORBIDDEN'
      });
    }

    req.resource = article;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error checking ownership' });
  }
};

module.exports = checkOwnership;
