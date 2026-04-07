const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot be more than 150 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: 'Admin',
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexing for search performance
newsSchema.index({ title: 'text', content: 'text' });
newsSchema.index({ category: 1 });

module.exports = mongoose.model('News', newsSchema);
