const express = require("express");
const router = express.Router();
require("dotenv").config();
const {
  broadcastInventoryUpdate,
  broadcastTimbangUpdate,
} = require("../websocket");

const {
  insertHistoryTimbang,
  insertHistoryInventori,
  updateSembelih,
} = require("../database/db");

router.post("/history-timbang", async (req, res) => {
  const { hasil_timbang_id, operation, value } = req.body;
  console.log("Received /history-timbang request:", req.body);
  try {
    const result = await insertHistoryTimbang(
      hasil_timbang_id,
      operation,
      value
    );
    await broadcastTimbangUpdate(); // Broadcast the update
    res.json(result);
  } catch (err) {
    console.error("Error handling /history-timbang request:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/history-inventori", async (req, res) => {
  const { inventori_id, operation, value } = req.body;
  console.log("Received /history-inventori request:", req.body);
  try {
    const result = await insertHistoryInventori(inventori_id, operation, value);
    await broadcastInventoryUpdate(); // Broadcast the update
    res.json(result);
  } catch (err) {
    console.error("Error handling /history-inventori request:", err);
    res.status(500).json({ error: err.message });
  }
});

// Route to handle updating the sembelih field
router.post("/update-sembelih", async (req, res) => {
  const { id, sembelih } = req.body;
  console.log("Received /update-sembelih request:", req.body);
  try {
    const result = await updateSembelih(id, sembelih);
    res.json(result);
  } catch (err) {
    console.error("Error handling /update-sembelih request:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
