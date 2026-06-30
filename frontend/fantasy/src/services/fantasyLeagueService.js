const API_URL = 'http://localhost:3001/api/fantasy-leagues'

export async function getPublicFantasyLeagues(){
    const response = await fetch(`${API_URL}/public`)

    if(!response.ok)
        throw new Error("Can't fetch public leagues!")

    return await response.json()

}

export async function createFantasyLeague(data) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to create fantasy league")
    }

    return await response.json()
}