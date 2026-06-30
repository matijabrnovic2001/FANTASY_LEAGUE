const SeasonController = require('../controllers/season.controller')
const express = require('express')
const router = express.Router()

router.get('/', SeasonController.getAll)
router.get('/:id', SeasonController.getById)
router.post('/', SeasonController.create)
router.delete('/:id', SeasonController.delete)
router.put('/:id', SeasonController.update)

module.exports = router