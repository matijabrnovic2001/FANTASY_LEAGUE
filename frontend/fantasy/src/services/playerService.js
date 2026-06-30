const API_URL = 'http://localhost:3001/api/players'

export async function getPlayerStats({season}) {
    const response = await fetch(`${API_URL}/stats?season=${season}`)
    if (!response.ok) {
        throw new Error("Failed to fetch player stats for season")
    }

    return await response.json()
}