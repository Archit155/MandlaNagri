const articleRepository = require('../repositories/ArticleRepository');
const Category = require('../models/Category');

class ArticleService {
  async getAllArticles(queryOptions) {
    const page = parseInt(queryOptions.page, 10) || 1;
    const limit = parseInt(queryOptions.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let filter = { status: 'published' };

    // Category
    if (queryOptions.category && queryOptions.category.toLowerCase() !== 'all') {
      filter.category = { $regex: new RegExp(`^${queryOptions.category}$`, 'i') };
    }

    // Search
    if (queryOptions.q) {
      filter.$or = [
        { title: { $regex: queryOptions.q, $options: 'i' } },
        { content: { $regex: queryOptions.q, $options: 'i' } }
      ];
    }
    
    // Author filter
    if (queryOptions.authorId) {
      filter.author = queryOptions.authorId;
    }

    const total = await articleRepository.count(filter);
    const pages = Math.ceil(total / limit);
    const articles = await articleRepository.findAll({ filter, skip, limit });

    return {
      count: articles.length,
      pages,
      data: articles,
      meta: { page, limit, total }
    };
  }

  async getArticleById(id) {
    return articleRepository.findById(id);
  }

  async createArticle(data, authorId) {
    if (data.category) {
      await this._ensureCategoryExists(data.category);
    }
    return articleRepository.create({ ...data, author: authorId });
  }

  async updateArticle(id, data) {
    if (data.category) {
      await this._ensureCategoryExists(data.category);
    }
    return articleRepository.update(id, data);
  }

  async deleteArticle(id) {
    return articleRepository.delete(id);
  }

  // Helper to find or create category case-insensitively
  async _ensureCategoryExists(name) {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Capitalize first letter: "sports" -> "Sports"
    const formattedName = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);

    const existing = await Category.findOne({ 
      name: { $regex: new RegExp(`^${formattedName}$`, 'i') } 
    });

    if (!existing) {
      await Category.create({ name: formattedName });
      console.info(`🛠️  New category created: ${formattedName}`);
    }
  }
}

module.exports = new ArticleService();
