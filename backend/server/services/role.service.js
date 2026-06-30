const RoleModel = require('../models/role.model')


const RoleService = {
    getAll: async ()=>{
        return await RoleModel.getAll()
    },
    
    getById: async (id)=>{
        const role = await RoleModel.getById(id)
        if(!role) throw new Error('No such role!')
        return role
    },

    getByCode:async (roleCode)=>{
        const role = await RoleModel.getByCode(roleCode)
        if(!role) throw new Error('No such role!')
        return role
    },
    create: async ({role_name, role_code})=>{
        return await RoleModel.create({role_code, role_name})
    },
    delete: async (id)=>{
        const deleted = await RoleModel.delete(id)
        if(!deleted) throw new Error('No such role!')
        return deleted
    }

}

module.exports = RoleService