const articleRepository = require('../repositories/ArticleRepository');

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
    return articleRepository.create({ ...data, author: authorId });
  }

  async updateArticle(id, data) {
    return articleRepository.update(id, data);
  }

  async deleteArticle(id) {
    return articleRepository.delete(id);
  }
}

module.exports = new ArticleService();
