const FantasyContractController = require('../controllers/fantasy_contract.controller')
const express = require('express')

const router = express.Router()

router.get('/', FantasyContractController.getAll)
router.get('/:id', FantasyContractController.getById)
router.post('/', FantasyContractController.create)
router.put('/:id', FantasyContractController.update)
router.delete('/:id', FantasyContractController.delete)

module.exports = router