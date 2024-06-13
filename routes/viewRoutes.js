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
      inventoryMap[item.name] = item.hasil;
    });

    const timbang = await getTimbang();
    const timbangMap = {};
    timbang.forEach((item) => {
      timbangMap[item.name] = item.hasil;
    });

    res.render("index", {
      title: "Home",
      inventory: inventoryMap,
      timbang: timbangMap,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/forms", (req, res) => {
  res.render("forms", { title: "Forms" });
});

router.get("/counter-timbang", async (req, res) => {
  try {
    const timbang = await getTimbang();
    const timbangMap = {};
    timbang.forEach((item) => {
      timbangMap[item.name] = item.hasil;
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
      inventoryMap[item.name] = item.hasil;
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
