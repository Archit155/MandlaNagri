const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionsMiddleware');
const checkOwnership = require('../middleware/checkOwnership');
const { PERMISSIONS } = require('../config/permissions');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(
    protect,
    checkPermission(PERMISSIONS.CREATE_ARTICLE),
    upload.array('photos', 3),
    articleController.createArticle
  );

router
  .route('/:id')
  .get(articleController.getArticleById)
  .put(
    protect,
    checkPermission(PERMISSIONS.EDIT_ARTICLE),
    checkOwnership,
    articleController.updateArticle
  )
  .delete(
    protect,
    checkPermission(PERMISSIONS.DELETE_ARTICLE), // Only admin gets this permission via config
    articleController.deleteArticle
  );

module.exports = router;
