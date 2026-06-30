import {useEffect, useState} from 'react'
import {getSeasons} from '../../services/seasonService.js'
import {getRoles} from "../../services/roleService.js";
import './PlayerTableDash.css'

const PlayerTableDash = ({
                             searchTerm,
                             setSearchTerm,
                             selectedSeason,
                             setSelectedSeason,
                             selectedRole,
                             setSelectedRole,
                             isPerGameView,
                             setIsPerGameView
})=>{

    const [seasons, setSeasons ] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=>{
        async function loadSeasons() {
            try {
                const [seasonData, roleData] = await Promise.all([
                    getSeasons(),
                    getRoles()
                ])

                setSeasons(seasonData)
                setRoles(roleData)

            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        loadSeasons()
    }, [])


    if (loading) return <p>Loading player stats...</p>
    if (error) return <p>{error}</p>

    return (
        <div className='player-table-dash'>
            <input
                type="text"
                placeholder="🔍 Search by IGN . . ."
                value={searchTerm}
                onChange={(e)=>{
                    setSearchTerm(e.target.value)
                }}
            />

            <select
                value={selectedSeason}
                onChange={(e) =>
                    setSelectedSeason(Number(e.target.value))
                }
            >
                {seasons.map(season=> (<option
                        value={season.id}
                        key={season.id}>
                        {`${season.szn_name} ${season.szn_year}`}
                </option>)
                )}
            </select>

            <select
                value={selectedRole}
                onChange={(e)=>{
                    setSelectedRole(e.target.value)
                }}
            >
                <option value="">ALL ROLES </option>
                {roles.map(role=> (
                    <option
                        key={role.id}
                        value={role.id}>
                            {role.role_code.toUpperCase()}
                    </option>
                ))

                }
            </select>

            <button
                className="filter-button"
                onClick={() => setIsPerGameView(!isPerGameView)}
            >
                {isPerGameView ? "Per Game: ON" : "Per Game: OFF"}
            </button>

        </div>
    )
}

export default PlayerTableDash