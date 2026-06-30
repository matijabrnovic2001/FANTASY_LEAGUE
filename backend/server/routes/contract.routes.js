const ContractController = require('../controllers/contract.controller')
const express = require('express')

const router = express.Router()

router.get('/', ContractController.getAll)
router.get('/:id', ContractController.getById)
router.post('/', ContractController.create)
router.put('/:id', ContractController.update)
router.delete('/:id', ContractController.delete)
router.patch('/:id/deactivate', ContractController.deactivateContract)

module.exports = router