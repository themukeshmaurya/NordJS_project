import express = require("express");
const {shortUrl,getAnalytics} = require("../controller/url");

const router = express.Router();

router.post('/',shortUrl);

router.get('/analytics/:shortId',getAnalytics);



module.exports = router;