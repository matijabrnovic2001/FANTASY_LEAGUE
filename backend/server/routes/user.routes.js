const UserController = require('../controllers/user.controller')
const express = require('express')

const router = express.Router()

router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.delete('/:id', UserController.delete)

router.patch('/:id/admin', UserController.turnToAdmin)

module.exports = router