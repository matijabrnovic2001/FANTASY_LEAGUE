const FantasyTeamController = require('../controllers/fantasy_team.controller')
const express = require('express')

const router = express.Router()

router.get('/', FantasyTeamController.getAll)
router.get('/:id', FantasyTeamController.getById)
router.post('/', FantasyTeamController.create)
router.put('/:id', FantasyTeamController.update)
router.delete('/:id', FantasyTeamController.delete)

module.exports = router