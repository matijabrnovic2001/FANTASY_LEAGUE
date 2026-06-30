const API_URL = 'http://localhost:3001/api/stats'

export async function getStats({player, match}){
    const response = await
        fetch(`${API_URL}?player=${player}&for_match=${match}`)

    if(!response.ok){
        throw new Error("Can't fetch stats!")
    }

    return await response.json()
}

export async function createStat({player, for_match, kills, deaths, assists, farm, obj}) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            player,
            for_match,
            kills,
            deaths,
            assists,
            farm,
            obj
        })
    })

    if(!response.ok){
        throw new Error("Can't create player stats!")
    }

    return await response.json()
}