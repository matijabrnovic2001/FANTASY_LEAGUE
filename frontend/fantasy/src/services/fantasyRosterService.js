const API_URL = "http://localhost:3001/api/fantasy-teams"

export async function getFantasyTeam({owner}){
    const response = await fetch(`${API_URL}?owner=${owner}`)

    if(!response.ok){
        throw new Error("Can't fetch user's fantasy roster!")
    }

    return await response.json()
}

export async function createFantasyTeam({ team_name, owner }) {
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            team_name,
            owner
        })
    })

    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to create fantasy team")
    }

    return await response.json()
}