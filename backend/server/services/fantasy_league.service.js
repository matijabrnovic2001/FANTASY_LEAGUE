const FantasyLeagueModel = require('../models/fantasy_league.model')

const FantasyLeagueService = {
    getAll: async () => {
        return await FantasyLeagueModel.getAll()
    },

    getPublic: async () => {
        return await FantasyLeagueModel.getPublic()
    },

    getById: async (id) => {
        const league = await FantasyLeagueModel.getById(id)
        if (!league) throw new Error('No such fantasy league!')
        return league
    },

    getByCode: async (league_code) => {
        const league = await FantasyLeagueModel.getByCode(league_code)
        if (!league) throw new Error('No such fantasy league!')
        return league
    },

    create: async ({
        league_name,
        league_code,
        description,
        owner_user,
        max_cap,
        is_public,
        is_official
    }) => {
        return await FantasyLeagueModel.create({
            league_name,
            league_code,
            description,
            owner_user,
            max_cap,
            is_public,
            is_official
        })
    },

    update: async (id, {
        league_name,
        league_code,
        description,
        max_cap,
        is_public,
        is_active,
        is_official
    }) => {
        const updated = await FantasyLeagueModel.update(id, {
            league_name,
            league_code,
            description,
            max_cap,
            is_public,
            is_active,
            is_official
        })

        if (!updated) throw new Error('No such fantasy league!')
        return updated
    },

    delete: async (id) => {
        const deleted = await FantasyLeagueModel.delete(id)
        if (!deleted) throw new Error('No such fantasy league!')
        return deleted
    }
}

module.exports = FantasyLeagueService