const FantasyLeagueMembershipController = require('../controllers/fantasy_league_membership.controller')
const express = require('express')

const router = express.Router()

router.get('/', FantasyLeagueMembershipController.getAll)
router.get('/count/:fantasy_league', FantasyLeagueMembershipController.countByLeague)
router.get('/is-member', FantasyLeagueMembershipController.isMember)
router.get('/league/:fantasy_league', FantasyLeagueMembershipController.getMembersByLeague)
router.post('/', FantasyLeagueMembershipController.create)
router.get('/team/:fantasy_team', FantasyLeagueMembershipController.getLeaguesByFantasyTeam)
router.delete('/:fantasy_team/:fantasy_league',FantasyLeagueMembershipController.delete)

module.exports = router