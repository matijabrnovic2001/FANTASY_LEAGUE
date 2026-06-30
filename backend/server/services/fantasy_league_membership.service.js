const FantasyLeagueMembershipModel = require('../models/fantasy_league_membership.model')
const FantasyLeagueModel = require('../models/fantasy_league.model')

const FantasyLeagueMembershipService = {
    getAll: async ({fantasy_team, fantasy_league} = {}) => {
        return await FantasyLeagueMembershipModel.getAll({
            fantasy_team,
            fantasy_league
        })
    },

    create: async ({fantasy_team, fantasy_league}) => {
        const league = await FantasyLeagueModel.getById(fantasy_league)

        if (!league) {
            throw new Error('No such fantasy league!')
        }

        if (await FantasyLeagueMembershipModel.isMember({fantasy_team, fantasy_league})) {
            throw new Error('Team is already in the league!')
        }

        const memberCount = await FantasyLeagueMembershipModel.countByLeague({
            fantasy_league
        })

        if (memberCount >= league.max_cap) {
            throw new Error('League already full!')
        }

        return await FantasyLeagueMembershipModel.create({
            fantasy_team,
            fantasy_league
        })
    },

    delete: async ({fantasy_team, fantasy_league}) => {
        const deleted = await FantasyLeagueMembershipModel.delete({
            fantasy_team,
            fantasy_league
        })

        if (!deleted) {
            throw new Error('No such membership!')
        }

        return deleted
    },

    countByLeague: async ({fantasy_league}) => {
        return await FantasyLeagueMembershipModel.countByLeague({
            fantasy_league
        })
    },

    isMember: async ({fantasy_team, fantasy_league}) => {
        return await FantasyLeagueMembershipModel.isMember({
            fantasy_team,
            fantasy_league
        })
    },
    getMembersByLeague: async ({fantasy_league}) => {
        return await FantasyLeagueMembershipModel.getMembersByLeague({
            fantasy_league
        })
    },
    getLeaguesByFantasyTeam: async ({fantasy_team}) => {
        return await FantasyLeagueMembershipModel.getLeaguesByFantasyTeam({
            fantasy_team
        })
    }
}

module.exports = FantasyLeagueMembershipService