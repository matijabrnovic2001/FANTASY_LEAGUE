const API_URL = 'http://localhost:3001/api/matches'

export async function getRecentForm({team, season, region, limit=4}){
    const response = await
        fetch(`${API_URL}/form?season=${season}&team=${team}&region=${region}&limit=${limit}`)

    if(!response.ok)
        throw new Error("Can't fetch form!")

    return await response.json()
}

export async function getMatchesWithTeamInfo({ season, region }) {
    const response = await fetch(
        `http://localhost:3001/api/matches/with-team-info?season=${season}&region=${region}`
    )

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    return await response.json()
}

export async function createMatch({home_team, away_team, season, region, date_played, home_team_wins, away_team_wins, match_format}) {
    const token = localStorage.getItem("token")

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            home_team,
            away_team,
            season,
            region,
            date_played,
            home_team_wins,
            away_team_wins,
            match_format
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || data.message || "Can't create match")
    }

    return data
}