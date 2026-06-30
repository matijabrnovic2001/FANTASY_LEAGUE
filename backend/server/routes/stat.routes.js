const StatController = require('../controllers/stat.controller')
const express = require('express')

const router = express.Router()

router.get('/', StatController.getAll)
router.get('/:id', StatController.getById)
router.post('/', StatController.create)
router.put('/:id', StatController.update)
router.delete('/:id', StatController.delete)

module.exports = router