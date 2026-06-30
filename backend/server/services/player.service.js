const PlayerModel = require('../models/player.model')

const PlayerService = {
    getAll: async ({player_role, residency, search})=>{
        return await PlayerModel.getAll({player_role, residency, search})
    },
    getById: async (id)=>{
        const player = await PlayerModel.getById(id)
        if(!player) throw new Error('No such player!')
        return player
    },
    create: async ({player_ign, full_name, birth_date, residency, player_role, fantasy_price})=>{
        validatePlayer(birth_date, fantasy_price)
        return await PlayerModel.create({
            player_ign, 
            full_name, 
            birth_date, 
            residency, 
            player_role, 
            fantasy_price
        })
    },
    delete: async (id)=>{
        const deleted = await PlayerModel.delete(id)
        if(!deleted) throw new Error('No such player!');
        return deleted
    },
    update: async (id,{player_ign, full_name, birth_date, residency, player_role, fantasy_price})=>{
        validatePlayer(birth_date, fantasy_price)
        const updated = await PlayerModel.update(id, {
            player_ign, 
            full_name, 
            birth_date, 
            residency, 
            player_role, 
            fantasy_price
        })
        if(!updated) throw new Error('No such player!');
        return updated
    },
    getPlayerStats: async ({ season }) => {
        if (!season) {
            throw new Error('Season is required!')
        }

        return await PlayerModel.getPlayerStats({ season })
    }

}

function validatePlayer(birth_date, fantasy_price){
    const currDate = new Date()
    const birthDateObj = new Date(birth_date)

    if(Number.isNaN(birthDateObj.getTime())) 
        throw new Error('Invalid birth date!')
    if(birthDateObj > currDate) 
        throw new Error('Invalid birth date!')
    if(fantasy_price!=null && (fantasy_price < 2000 || fantasy_price > 7000)) 
        throw new Error('Fantasy price out of bounds!')

}

module.exports = PlayerService