const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { categoryCreate, categoryGet, categoryEdit, categoryDelete } = require("../controllers/categoryController");

router.post("/", authenticateSession, categoryCreate);
router.get("/", authenticateSession, categoryGet);
router.put("/", authenticateSession, categoryEdit);
router.delete("/", authenticateSession, categoryDelete);

module.exports = router;