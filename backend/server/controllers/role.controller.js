const RoleService = require('../services/role.service')

const RoleController = {
    getAll: async(req, res)=>{
        try {
            const roles = await RoleService.getAll()
            res.status(200).json(roles)
            
        } catch (err){
            res.status(500).json({error: err.message})
        }
    },

    getById: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const role = await RoleService.getById(id)
            res.status(200).json(role)
            
        } catch (err){
            if(err.message === 'No such role!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    /*getByCode: async(req, res)=>{
        try {

            const roles = await RoleService.getByCode()
            res.status(200).json(roles)
            
        } catch (err){
            if(err.message === 'No such role!') res.status(404).({error: err.message})
            res.status(500).json({error: err.message})
        }
    }, */

    create: async(req, res)=>{
        try {
            const {role_name, role_code} = req.body
            const insertId = await RoleService.create({role_name, role_code})
            res.status(201).json(insertId)
            
        } catch (err){
            res.status(500).json({error: err.message})
        }
    },

    delete: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            await RoleService.delete(id)
            
            res.status(204).send();
            
        } catch (err){
            if(err.message === 'No such role!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },
}

module.exports = RoleController