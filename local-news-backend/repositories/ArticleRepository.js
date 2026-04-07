const Article = require('../models/Article');

class ArticleRepository {
  async findAll({ filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 } }) {
    return Article.find(filter)
      .populate('author', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async count(filter = {}) {
    return Article.countDocuments(filter);
  }

  async findById(id) {
    return Article.findById(id).populate('author', 'name email role');
  }

  async create(articleData) {
    return Article.create(articleData);
  }

  async update(id, updateData) {
    return Article.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return Article.findByIdAndDelete(id);
  }
}

module.exports = new ArticleRepository();
