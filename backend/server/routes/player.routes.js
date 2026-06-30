const PlayerController = require('../controllers/player.controller')
const express = require('express')
const router = express.Router()

router.get('/', PlayerController.getAll)
router.get('/stats', PlayerController.getPlayerStats)
router.get('/:id', PlayerController.getById)
router.post('/', PlayerController.create)
router.put('/:id', PlayerController.update)
router.delete('/:id', PlayerController.delete)



module.exports = router