const express = require('express')
const router = express.Router()

const ScoringRuleController = require('../controllers/scoring_rule.controller')

router.get('/', ScoringRuleController.getAll)
router.get('/:id', ScoringRuleController.getById)
router.post('/', ScoringRuleController.create)
router.put('/:id', ScoringRuleController.update)
router.delete('/:id', ScoringRuleController.delete)

module.exports = router