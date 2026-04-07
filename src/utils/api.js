const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchNews = async (params = {}) => {
  const { category, q, page = 1, limit = 10 } = params;
  
  const queryParams = new URLSearchParams();
  if (category && category.toLowerCase() !== 'all') {
    queryParams.append('category', category.toLowerCase());
  }
  if (q) queryParams.append('q', q);
  queryParams.append('page', page);
  queryParams.append('limit', limit);

  const res = await fetch(`${API_URL}/news?${queryParams.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch news');
  }
  return res.json();
};

export const fetchNewsById = async (id) => {
  const res = await fetch(`${API_URL}/news/${id}`);
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};
