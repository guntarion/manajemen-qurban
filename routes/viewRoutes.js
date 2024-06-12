const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");


// Page routes
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});


router.get("/forms", (req, res) => {
  res.render("forms", { title: "Forms" });
});

router.get("/counter-timbang", (req, res) => {
  res.render("counter-timbang", { title: "Counter Timbang" });
});


module.exports = router;