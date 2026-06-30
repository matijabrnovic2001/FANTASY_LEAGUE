const UserService = require('../services/user.service')

const UserController = {
    getAll: async(req, res)=>{
        try {
            const users = await UserService.getAll()
            res.status(200).json(users)

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    getById: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const user = await UserService.getById(id)
            res.status(200).json(user)

        } catch(err) {
            if(err.message === 'No such user!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    delete: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            await UserService.delete(id)
            res.status(204).send()

        } catch(err) {
            if(err.message === 'No such user!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    turnToAdmin: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            await UserService.turnToAdmin(id)
            res.status(200).send()

        } catch(err) {
            if(err.message === 'No such user!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = UserController