const AuthService = require('../services/auth.service')

const AuthController = {
    register: async(req, res)=>{
        try {
            const {email, username, password, birth_date} = req.body
            const insertId = await AuthService.register({email, username, password, birth_date})
            res.status(201).json({id: insertId})

        } catch(err) {
            if(err.message === 'Invalid email!')
                return res.status(400).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    login: async(req, res)=>{
        try {
            const {email, password} = req.body
            const data = await AuthService.login({email, password})
            res.status(200).json(data)

        } catch(err) {
            if(err.message === 'Invalid credentials!')
                return res.status(401).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = AuthController