const express = require("express");
const router = express.Router();
require("dotenv").config();

const {
  insertHistoryTimbang,
  insertHistoryInventori,
} = require("../database/db");

router.post("/history-timbang", async (req, res) => {
  const { hasil_timbang_id, operation, value } = req.body;
  try {
    const result = await insertHistoryTimbang(
      hasil_timbang_id,
      operation,
      value
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/history-inventori", async (req, res) => {
  const { inventori_id, operation, value } = req.body; // Ensure payload keys match
  try {
    const result = await insertHistoryInventori(inventori_id, operation, value);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
