const express = require('express');

const router = express.Router()
const { registerUser, authUser, alluser ,mailSender} = require("../controllers/UserControllers")

const { protect } = require("../middleware/authMiddleware")
router.post("/", registerUser)
router.get("/", protect, alluser)

router.post("/login", authUser)
router.post("/otp",mailSender)
module.exports = router