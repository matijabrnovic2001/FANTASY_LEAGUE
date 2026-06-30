const MatchController = require('../controllers/match.controller')
const express = require('express')

const router = express.Router()

router.get('/', MatchController.getAll)
router.get('/form', MatchController.getForm)
router.get("/with-team-info", MatchController.getMatchesWithTeamInfo)
router.get('/:id', MatchController.getById)
router.post('/', MatchController.create)
router.put('/:id', MatchController.update)
router.delete('/:id', MatchController.delete)

module.exports = router