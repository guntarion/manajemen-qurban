const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { getInventory, getTimbang } = require("../database/db");

// Page routes
router.get("/", async (req, res) => {
  try {
    const inventory = await getInventory();
    const inventoryMap = {};
    inventory.forEach((item) => {
      inventoryMap[item.name] = {
        hasil: item.hasil,
        target_value: item.target_value,
      };
    });

    const timbang = await getTimbang();
    const timbangMap = {};
    timbang.forEach((item) => {
      timbangMap[item.name] = {
        hasil: item.hasil,
      };
    });

    res.render("index", {
      title: "Home",
      inventory: inventoryMap,
      timbang: timbangMap,
      wsUrl: process.env.NODE_ENV === 'production' ? 'ws://68.183.186.142:5050' : 'ws://localhost:5050',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/progres-sembelih", (req, res) => {
  res.render("progres-sembelih", { title: "Progres Sembelih" });
});

router.get("/counter-timbang", async (req, res) => {
  try {
    const timbang = await getTimbang();
    const timbangMap = {};
    timbang.forEach((item) => {
      timbangMap[item.name] = {
        hasil: item.hasil,
        target_value: item.target_value,
      };
    });
    res.render("counter-timbang", {
      title: "Counter Timbang",
      timbang: timbangMap,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/counter-inventori", async (req, res) => {
  try {
    const inventory = await getInventory();
    const inventoryMap = {};
    inventory.forEach((item) => {
      inventoryMap[item.name] = {
        hasil: item.hasil,
        target_value: item.target_value, // Ensure target_value is included
      };
    });
    res.render("counter-inventori", {
      title: "Counter Inventori",
      inventory: inventoryMap,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
