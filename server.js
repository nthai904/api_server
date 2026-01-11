require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors({
  origin: "https://h5.zdn.vn",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

app.use(express.json());

const haravan = axios.create({
  baseURL: "https://apis.haravan.com",
  headers: {
    Authorization: `Bearer ${process.env.HARAVAN_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/* ================= PRODUCTS ================= */

// /api/product
app.get("/api/product", async (req, res) => {
  try {
    const result = await haravan.get("/com/products.json");
    res.json(result.data);
  } catch (e) {
    res.status(500).json(e.response?.data || e.message);
  }
});

// /api/product/:id
app.get("/api/product/:id", async (req, res) => {
  try {
    const result = await haravan.get(`/com/products/${req.params.id}.json`);
    res.json(result.data);
  } catch (e) {
    res.status(500).json(e.response?.data || e.message);
  }
});

/* ================= BLOG ================= */

// /api/blog
app.get("/api/blog", async (req, res) => {
  try {
    const result = await haravan.get("/web/blogs.json");
    res.json(result.data);
  } catch (e) {
    res.status(500).json(e.response?.data || e.message);
  }
});

// /api/blog/:id
app.get("/api/blog/:id", async (req, res) => {
  try {
    const result = await haravan.get(`/web/blogs/${req.params.id}/articles.json`);
    res.json(result.data);
  } catch (e) {
    res.status(500).json(e.response?.data || e.message);
  }
});

// /api/blog/:id/count
app.get("/api/blog/:id/count", async (req, res) => {
  try {
    const result = await haravan.get(`/web/blogs/${req.params.id}/articles/count.json`);
    res.json(result.data);
  } catch (e) {
    res.status(500).json(e.response?.data || e.message);
  }
});

/* ================= COLLECTION ================= */

app.get("/api/collection", async (req, res) => {
  try {
    const result = await haravan.get("/com/custom_collections.json");
    res.json(result.data);
  } catch (e) {
    res.status(500).json(e.response?.data || e.message);
  }
});

/* ================= COLLECT ================= */

app.get("/api/collect", async (req, res) => {
  try {
    const result = await haravan.get("/com/collects.json");
    res.json(result.data);
  } catch (e) {
    res.status(500).json(e.response?.data || e.message);
  }
});

/* ================= ORDER ================= */

app.post("/api/order", async (req, res) => {
  try {
    const result = await haravan.post("/com/orders.json", req.body);
    res.json(result.data);
  } catch (e) {
    res.status(500).json(e.response?.data || e.message);
  }
});

/* ================= HEALTH ================= */

app.get("/", (req,res)=>{
  res.send("Haravan Proxy for Zalo Mini App running...");
});

app.listen(3000, ()=> console.log("🚀 Proxy running at http://localhost:3000"));
