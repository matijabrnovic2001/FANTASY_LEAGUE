const API_URL = 'http://localhost:3001/api/roles'

export async function getRoles(){
    const response = await fetch(API_URL)
    if(!response.ok)
        throw new Erorr("Can't fetch roles")

    return await response.json()
}