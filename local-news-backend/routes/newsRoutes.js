const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getCategories
} = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/categories').get(getCategories);

router
  .route('/')
  .get(getAllNews)
  .post(protect, createNews);

router
  .route('/:id')
  .get(getNewsById)
  .put(protect, updateNews)
  .delete(protect, deleteNews);

module.exports = router;
