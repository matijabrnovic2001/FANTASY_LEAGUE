const API_URL = "http://localhost:3001/api/fantasy-league-memberships"

export async function getMemberCount({ fantasy_league }) {
    const response = await fetch(`${API_URL}/count/${fantasy_league}`)

    if (!response.ok) {
        throw new Error("Can't fetch member count!")
    }

    return await response.json()
}

export async function isFantasyTeamMember({ fantasy_team, fantasy_league }) {
    const response = await fetch(
        `${API_URL}/is-member?fantasy_team=${fantasy_team}&fantasy_league=${fantasy_league}`
    )

    if (!response.ok) {
        throw new Error("Can't check league membership!")
    }

    return await response.json()
}

export async function getLeagueMembers({ fantasy_league }) {
    const response = await fetch(`${API_URL}/league/${fantasy_league}`)

    if (!response.ok) {
        throw new Error("Can't fetch league members!")
    }

    return await response.json()
}

export async function getLeaguesByFantasyTeam({fantasy_team}) {
    const response = await fetch(`${API_URL}/team/${fantasy_team}`)

    if (!response.ok) {
        throw new Error("Can't fetch joined leagues!")
    }

    return await response.json()
}

export async function joinFantasyLeague({fantasy_team, fantasy_league}) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fantasy_team,
            fantasy_league
        })
    })

    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Can't join fantasy league!")
    }
}

export async function leaveFantasyLeague({fantasy_team, fantasy_league}) {
    const response = await fetch(`${API_URL}/${fantasy_team}/${fantasy_league}`, {
        method: "DELETE"
    })

    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Can't leave fantasy league!")
    }
}