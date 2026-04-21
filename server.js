require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const { createHmac } = require("crypto");

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

// /api/blog/:blog_id/article/:article_id  -> article details
app.get("/api/blog/:blog_id/article/:article_id", async (req, res) => {
  try {
    const { blog_id, article_id } = req.params;
    const result = await haravan.get(`/web/blogs/${blog_id}/articles/${article_id}.json`);
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

app.get("/api/order", async (req, res) => {
  try {
    const params = req.query || {};
    const result = await haravan.get("/com/orders.json", { params });
    res.json(result.data);
  } catch (e) {
    const statusCode = e.response?.status || 500;
    res.status(statusCode).json(e.response?.data || { error: e.message });
  }
});


app.post("/api/order", async (req, res) => {
  try {
    const orderData = req.body.order ? req.body : { order: req.body };
    const result = await haravan.post("/com/orders.json", orderData);
    res.json(result.data);
  } catch (e) {
    const statusCode = e.response?.status || 500;
    res.status(statusCode).json(e.response?.data || { error: e.message });
  }
});


app.post("/api/create-mac", (req, res) => {
  try {
    const { amount, desc, item, extradata, method } = req.body;

    const normalize = (val) =>
      typeof val === "string" ? val : JSON.stringify(val);

    const params = {
      amount,
      desc,
      item: normalize(item),
      extradata: normalize(extradata),
      method: normalize(method),
    };

    const dataMac = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const zcs = process.env.ZALO_CHECKOUT_SECRET_KEY;

    if (!zcs) {
      return res.status(500).json({ error: "Missing ZALO_CHECKOUT_SECRET_KEY in .env" });
    }

    const mac = createHmac("sha256", zcs).update(dataMac).digest("hex");

    res.json({
      mac,
      debug: {
        dataMac,
        data: { amount, desc, item, extradata, method },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req,res)=>{
  res.send("Haravan Proxy for Zalo Mini App running...");
});

app.listen(3000, ()=> console.log("🚀 Proxy running at http://localhost:3000"));
