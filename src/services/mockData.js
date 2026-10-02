export const MOCK_CATEGORIES = {
  items: [
    { id: '1', name: 'African Literature', slug: 'african-literature', image_url: 'https://images.unsplash.com/photo-1490633874781-1c63cc424610?q=80&w=300&auto=format&fit=crop' },
    { id: '2', name: 'Science Fiction', slug: 'science-fiction', image_url: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=300&auto=format&fit=crop' },
    { id: '3', name: 'Business & Tech', slug: 'business', image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=300&auto=format&fit=crop' },
    { id: '4', name: 'Self-Help', slug: 'self-help', image_url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=300&auto=format&fit=crop' },
  ],
};

export const MOCK_BOOKS = {
  items: [
    {
      id: '1',
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      slug: 'things-fall-apart',
      price: 15.99,
      discount_price: 12.99,
      cover_image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
      category: 'African Literature',
    },
    {
      id: '2',
      title: 'Dune',
      author: 'Frank Herbert',
      slug: 'dune',
      price: 24.99,
      cover_image_url: 'https://images.unsplash.com/photo-1518378188025-22bd89516ee2?q=80&w=400&auto=format&fit=crop',
      category: 'Science Fiction',
    },
    {
      id: '3',
      title: 'Atomic Habits',
      author: 'James Clear',
      slug: 'atomic-habits',
      price: 19.99,
      discount_price: 16.00,
      cover_image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop',
      category: 'Self-Help',
    },
    {
      id: '4',
      title: 'Zero to One',
      author: 'Peter Thiel',
      slug: 'zero-to-one',
      price: 22.50,
      cover_image_url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=400&auto=format&fit=crop',
      category: 'Business & Tech',
    },
  ],
  total: 4,
  total_pages: 1,
};
