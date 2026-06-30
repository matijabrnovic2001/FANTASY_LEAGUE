const API_URL = 'http://localhost:3001/api/teams'

export async function getTeamStandings({season, region}){
    const response = await fetch(
        `${API_URL}/standings?season=${season}&region=${region}`
    )

    if(!response.ok){
        throw new Error("Can't fetch standings!")
    }

    return await response.json()
}

export async function getTeams({region}) {
    const response = await fetch(`${API_URL}?region=${region}`)
    console.log(response)

    if(!response.ok){
        throw new Error("Can't fetch teams!")
    }

    return await response.json()
}

export async function getRoster({team}){
    const response = await fetch(`${API_URL}/roster?team=${team}`)
    if(!response.ok){
        throw new Error("Can't fetch roster!")
    }

    return await response.json()
}