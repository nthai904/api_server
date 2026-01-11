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
 * Zalo gọi: /api/products
 */
app.get("/api/products", async (req, res) => {
  try {
    const response = await haravan.get("/com/products.json", {
      params: {
        limit: 20,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: "Haravan API error",
      error: error.response?.data || error.message,
    });
  }
});

/**
 * Example: Get blog by ID
 * Zalo gọi: /api/blog/:id
 */
app.get("/api/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await haravan.get(`/com/blogs/${id}.json`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Get blog failed",
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
