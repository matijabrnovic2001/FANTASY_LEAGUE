const TeamController = require('../controllers/team.controller')
const express = require('express')
const router = express.Router()

router.get('/', TeamController.getAll)
router.get('/standings', TeamController.getStandings)
router.get('/roster', TeamController.getRoster)
router.get('/:id', TeamController.getById)

router.post('/', TeamController.create)
router.put('/:id', TeamController.update)
router.delete('/:id', TeamController.delete)

module.exports = router