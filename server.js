require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

/**
 * CORS cho Zalo Mini App
 */
app.use(
  cors({
    origin: "https://h5.zdn.vn",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/**
 * Base config Haravan
 */
const haravan = axios.create({
  baseURL: "https://apis.haravan.com",
  headers: {
    Authorization: `Bearer ${process.env.HARAVAN_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/**
 * Example: Get products
 * Zalo gọi: /api/products và /api/products/:id
 */
app.get("/api/product/:id?", async (req, res) => {
  try {
    const { id } = req.params;

    const url = id ? `/com/products/${id}.json` : `/com/products.json`;

    const response = await haravan.get(url, {
      params: id ? {} : { limit: 20 },
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: "Haravan Product API error",
      error: error.response?.data || error.message,
    });
  }
});

/**
 * Example: Get blog by ID
 * Zalo gọi: /api/blog/:id
 */
app.get("/api/blog/:id?/count?", async (req, res) => {
  try {
    const { id, count } = req.params;

    let url = "/web/blogs.json";

    if (id && count) {
      url = `/web/blogs/${id}/articles/count.json`;
    } else if (id) {
      url = `/web/blogs/${id}/articles.json`;
    }

    const response = await haravan.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: "Haravan Blog API error",
      error: error.response?.data || error.message,
    });
  }
});

app.get("/api/collection", async (req, res) => {
  try {
    const response = await haravan.get("/com/custom_collections.json");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Collection API error",
      error: error.response?.data || error.message,
    });
  }
});

app.post("/api/order", async (req, res) => {
  try {
    const response = await haravan.post("/com/orders.json", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: "Create order failed",
      error: error.response?.data || error.message,
    });
  }
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Haravan Proxy for Zalo Mini App is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
