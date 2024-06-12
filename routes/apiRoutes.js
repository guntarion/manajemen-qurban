const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
require("dotenv").config();


const { insertHistory } = require("../database/db");

router.post("/history", async (req, res) => {
  const { hasil_timbang_id, operation, value } = req.body;
  try {
    const result = await insertHistory(hasil_timbang_id, operation, value);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;