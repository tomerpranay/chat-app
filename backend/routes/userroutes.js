const express = require('express');

const router = express.Router()
const { registerUser, authUser, alluser } = require("../controllers/UserControllers")
const { protect } = require("../middleware/authMiddleware")
router.post("/", registerUser)
router.get("/", protect, alluser)

router.post("/login", authUser)

module.exports = router