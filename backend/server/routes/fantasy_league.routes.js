const FantasyLeagueController = require('../controllers/fantasy_league.controller')
const express = require('express')

const router = express.Router()

router.get('/', FantasyLeagueController.getAll)
router.get('/public', FantasyLeagueController.getPublic)
router.get('/code/:code', FantasyLeagueController.getByCode)
router.get('/:id', FantasyLeagueController.getById)
router.post('/', FantasyLeagueController.create)
router.put('/:id', FantasyLeagueController.update)
router.delete('/:id', FantasyLeagueController.delete)

module.exports = router