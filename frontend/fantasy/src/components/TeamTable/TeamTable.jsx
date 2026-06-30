import {getTeamStandings } from '../../services/teamService.js'
import {getRecentForm} from "../../services/matchService.js";
import {useState, useEffect} from "react";

import './TeamTable.css'

const TeamTable = ({season, region})=>{
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const logoBasePath = `/team_logos/`

    useEffect(()=>{
        async function loadStandings(season, region) {
            try {
                setLoading(true)
                setError(null)

                const standings = await getTeamStandings({season, region})
                const teamsWithForm = await Promise.all (
                    standings.map( async (team)=>{
                        const form = await getRecentForm({"team": team.id, season, region})
                        return {
                            ...team, form
                        }
                    })
                )

                setTeams(teamsWithForm)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadStandings(season, region)
    }, [season, region])

    if(loading) return <h1> Table loading . . . </h1>
    if (error) return <p>{error}</p>

    return (
        <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th> Position  </th>
                        <th> Team      </th>
                        <th> Played   </th>
                        <th> W        </th>
                        <th> L        </th>
                        <th> Form </th>
                    </tr>
                </thead>
                <tbody>
                {teams.map((team, index)=> (
                    <tr key={team.id}>
                        <td> {getPosition(teams, index)}</td>
                        <td>
                            <div className='team-mini-card'>
                                <img className='team-logo-icon' src={`${logoBasePath}${team.id}-${team.team_code}.png`} alt={team.code}/>
                                {team.team_code}
                            </div>
                        </td>
                        <td> {team.played_matches}   </td>
                        <td> {team.wins }        </td>
                        <td> {team.losses}        </td>
                        <td>
                            {team.form.map((match)=>(
                                <span className={`form-element-${match.result}`}>
                                    {match.result ? 'W ' : 'L '}
                                </span>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    )
}

function getPosition(teams, index) {
    if (index === 0) return 1

    const current = teams[index]
    const previous = teams[index - 1]

    const isTied =
        current.wins === previous.wins &&
        current.losses === previous.losses

    if (isTied) {
        return getPosition(teams, index - 1)
    }

    return index + 1
}

export default TeamTable