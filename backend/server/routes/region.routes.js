const RegionController = require('../controllers/region.controller')
const express = require('express')
const router = express.Router()

router.get("/", RegionController.getAll)

router.get("/:id", RegionController.getById)

router.post("/", RegionController.create)

router.delete("/:id", RegionController.delete)

module.exports = router
