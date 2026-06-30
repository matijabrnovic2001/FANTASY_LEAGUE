const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model')

const AuthService = {
    register: async({email, username, password, birth_date})=>{
        validateEmail(email)

        const password_hash = await bcrypt.hash(password, 10)
        const insertId = await UserModel.create({
            email,
            username,
            password_hash,
            birth_date
        })

        return insertId
    },

    login: async({email, password})=>{
        const user = await UserModel.getByEmail(email)
        if(!user) throw new Error('Invalid credentials!')

        const validPassword = await bcrypt.compare(password, user.password_hash)
        if(!validPassword) throw new Error('Invalid credentials!')

        const is_admin = Boolean(user.is_admin)

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                is_admin: is_admin
            },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        return {
            token, 
            user: {
                id: user.id,
                email: user.email,
                username: user.username, 
                is_admin
            }
        }
    }
}

function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!emailRegex.test(email))
        throw new Error('Invalid email!')
}

module.exports = AuthService