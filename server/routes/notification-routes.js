const { testNotify } = require("../controllers/notification-controller");

const router = require("express").Router();

router.post("/notification", testNotify);

module.exports = router;
