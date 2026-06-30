const API_URL = 'http://localhost:3001/api/contracts'

export async function getTeamRosters({team}){
    const response = await fetch(`${API_URL}?team=${team}`)
    if(!response.ok){
        throw new Error("Can't fetch team rosters!")
    }

    return await response.json()
}