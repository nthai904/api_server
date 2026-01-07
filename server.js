require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware để parse JSON
app.use(express.json());

// Proxy cho Haravan API - Products
app.use('/api/product', createProxyMiddleware({
  target: 'https://apis.haravan.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/product/(\\d+)': '/com/products/$1.json', // Chi tiết sản phẩm
    '^/api/product': '/com/products.json', // Danh sách sản phẩm
  },
  onProxyReq: (proxyReq, req, res) => {
    // Thêm header xác thực
    proxyReq.setHeader('Authorization', `Bearer ${process.env.API_TOKEN}`);
    proxyReq.setHeader('Content-Type', 'application/json');
  }
}));

// Proxy cho Haravan API - Blogs
app.use('/api/blog', createProxyMiddleware({
  target: 'https://apis.haravan.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/blog/(\\d+)/count': '/web/blogs/$1/articles/count.json', // Số lượng bài viết
    '^/api/blog/(\\d+)': '/web/blogs/$1/articles.json', // Bài viết theo blog ID
    '^/api/blog': '/web/blogs.json', // Danh sách blog
  },
  onProxyReq: (proxyReq, req, res) => {
    // Thêm header xác thực
    proxyReq.setHeader('Authorization', `Bearer ${process.env.API_TOKEN}`);
    proxyReq.setHeader('Content-Type', 'application/json');
  }
}));

// Proxy cho Haravan API - Orders
app.use('/api/order', createProxyMiddleware({
  target: 'https://apis.haravan.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/order': '/com/orders.json', // Danh sách đơn hàng
  },
  onProxyReq: (proxyReq, req, res) => {
    // Thêm header xác thực
    proxyReq.setHeader('Authorization', `Bearer ${process.env.API_TOKEN}`);
    proxyReq.setHeader('Content-Type', 'application/json');
  }
}));

// Proxy cho Haravan API - Collections
app.use('/api/collection', createProxyMiddleware({
  target: 'https://apis.haravan.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/collection': '/com/custom_collections.json', // Danh sách bộ sưu tập
  },
  onProxyReq: (proxyReq, req, res) => {
    // Thêm header xác thực
    proxyReq.setHeader('Authorization', `Bearer ${process.env.API_TOKEN}`);
    proxyReq.setHeader('Content-Type', 'application/json');
  }
}));

// Proxy cho Haravan API - Collects
app.use('/api/collect', createProxyMiddleware({
  target: 'https://apis.haravan.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/collect': '/com/collects.json', // Danh sách collect
  },
  onProxyReq: (proxyReq, req, res) => {
    // Thêm header xác thực
    proxyReq.setHeader('Authorization', `Bearer ${process.env.API_TOKEN}`);
    proxyReq.setHeader('Content-Type', 'application/json');
  }
}));

// Proxy cho provinces API
app.use('/api/provinces', createProxyMiddleware({
  target: 'https://provinces.open-api.vn',
  changeOrigin: true,
  pathRewrite: {
    '^/api/provinces': '/api/v1', // Chuyển đổi đường dẫn
  }
}));

// Route mặc định
app.get('/', (req, res) => {
  res.send('Haravan API Proxy Server Running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});