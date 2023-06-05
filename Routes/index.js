const express = require("express")
const router = express.Router();


router.use("/auth", require("./auth/index"))
router.use("/admin", require("./admin/index"))
router.use("/doctor", require("./doctor/index"))
router.use("/patients", require("./patients/index"))






module.exports = router;