const express = require("express")
const router = express.Router()

const ArchiveImageController = require("../controllers/archive_image.controller")
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware")

router.get("/", ArchiveImageController.getAll)
router.post("/upload", requireAuth, requireAdmin, ArchiveImageController.upload)

module.exports = router