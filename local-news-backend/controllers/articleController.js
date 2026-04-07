const articleService = require('../services/ArticleService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const result = await articleService.getAllArticles(req.query);
  res.status(200).json({ success: true, ...result });
});

exports.getArticleById = catchAsync(async (req, res, next) => {
  const article = await articleService.getArticleById(req.params.id);
  if (!article) {
    return next(new AppError('No article found with that ID', 404));
  }

  res.status(200).json({ success: true, data: article });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  
  if (req.files && req.files.length > 0) {
    data.images = req.files.map(file => `/uploads/${file.filename}`);
  }
  
  // Ensure category exists
  if (!data.category || data.category.trim() === '') {
    data.category = 'News';
  }

  delete data.image; // Remove old single image field if present

  const article = await articleService.createArticle(data, req.user.id);
  res.status(201).json({ success: true, data: article });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  // Ownership checked by checkOwnership middleware, so just update
  const article = await articleService.updateArticle(req.params.id, req.body);
  
  if (!article) {
    return next(new AppError('No article found with that ID', 404));
  }

  res.status(200).json({ success: true, data: article });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  await articleService.deleteArticle(req.params.id);
  res.status(200).json({ success: true, message: 'Article deleted' });
});
