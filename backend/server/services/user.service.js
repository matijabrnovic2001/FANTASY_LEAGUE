const UserModel = require('../models/user.model')

const UserService = {
    getAll: async()=>{
        return await UserModel.getAll()
    },

    getById: async(id)=>{
        const user = await UserModel.getById(id)
        if(!user) throw new Error('No such user!')
        return user
    },

    delete: async(id)=>{
        const deleted = await UserModel.delete(id)
        if(!deleted) throw new Error('No such user!')
        return deleted
    },

    turnToAdmin: async(id)=>{
        const updated = await UserModel.turnToAdmin(id)
        if(!updated) throw new Error('No such user!')
        return updated
    }
}

module.exports = UserService