import express = require("express");
const router = express.Router();
const {HomePage} = require("../controller/url");

router.get("/",HomePage);


module.exports = router;
