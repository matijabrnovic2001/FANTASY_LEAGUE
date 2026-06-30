import {getPlayerStats} from "../../services/playerService.js";
import {useState, useEffect} from "react"
import './PlayerTable.css'

const PlayerTable = ({ season, searchTerm, selectedRole, isPerGameView }) => {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const basePortraitUrl = '/player_portraits/'

    const displayStat = (total, matches) => {
        if (!isPerGameView) return total
        if (!matches || matches === 0) return 0

        return (Number(total) / Number(matches)).toFixed(1)
    }

    useEffect(() => {
        async function loadPlayerStats (season) {
            try {
                setLoading(true)
                setError(null)

                const data = await getPlayerStats({season})
                setPlayers(data)

            } catch (err){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadPlayerStats(season)
    }, [season])

    if (loading) return <p>Loading player stats...</p>
    if (error) return <p>{error}</p>

    const filteredPlayers = players.filter(player => {
        const matchesName = player.player_ign
            .toLowerCase()
            .includes(searchTerm.toLowerCase())

        const matchesRole = selectedRole === "" ||
            Number(player.player_role) === Number(selectedRole)

        return matchesName && matchesRole
    })

    return (
        <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Matches</th>
                        <th>K</th>
                        <th>D</th>
                        <th>A</th>
                        <th>Farm</th>
                        <th>Objectives</th>
                        <th>Fantasy Points</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPlayers.map(player=>
                        (
                            <tr key={player.id} >
                                <td className='player-mini-card'>
                                    <img className='player-headshot'
                                         src={`${basePortraitUrl}${player.player_ign}.png`}
                                         alt={player.player_ign + ' portrait'}/>

                                    <span> {player.player_ign} </span>

                                </td>
                                <td>{player.matches_played }</td>
                                <td>{displayStat(player.total_kills, player.matches_played)} </td>
                                <td>{displayStat(player.total_deaths, player.matches_played)} </td>
                                <td>{displayStat(player.total_assists, player.matches_played)}</td>
                                <td>{displayStat(player.total_farm, player.matches_played)}</td>
                                <td>{displayStat(player.total_obj, player.matches_played)}</td>
                                <td>{displayStat(player.fantasy_points, player.matches_played)}</td>
                            </tr>
                        ))}
                </tbody>
            </table>

        </div>
    )
}



export default PlayerTable;