const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getAllNews = async (req, res, next) => {
  try {
    const { category, q, page = 1, limit = 10 } = req.query;

    let query = {};

    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: news
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid ID' });
  }
};

// @desc    Create news
// @route   POST /api/news
// @access  Private (Admin)
exports.createNews = async (req, res, next) => {
  try {
    const { title, content, category, image, author } = req.body;

    const news = await News.create({
      title,
      content,
      category,
      image,
      author: author || 'Admin'
    });

    res.status(201).json({
      success: true,
      data: news
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (Admin)
exports.updateNews = async (req, res, next) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (Admin)
exports.deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid ID' });
  }
};

// @desc    Get distinct categories
// @route   GET /api/news/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await News.distinct('category');
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
