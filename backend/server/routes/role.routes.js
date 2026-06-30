const RoleController = require('../controllers/role.controller')
const express = require('express')

const router = express.Router()

router.get('/', RoleController.getAll)
router.get('/:id', RoleController.getById)
router.post('/', RoleController.create)
router.delete('/:id', RoleController.delete)

module.exports = router