import { useState, useEffect } from "react"
import { getTeams } from "../../services/teamService.js"

import "./FantasyPlayerList.css"

const FantasyPlayerList = ({
                               region = 3,
                               selectedRole,
                               setSelectedRole,
                               roles,
                               players = [],
                               contracts,
                               contractQueue,
                               onTogglePlayer,
                               remainingBudget
                           }) => {
    const [teams, setTeams] = useState([])

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTeam, setSelectedTeam] = useState("all")
    const [metric, setMetric] = useState("points")
    const [isPerGame, setIsPerGame] = useState(false)
    const [priceCap, setPriceCap] = useState(12000)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const basePortraitUrl = '/player_portraits/'

    useEffect(() => {
        async function fetchData() {
            setError(null)
            setLoading(true)

            try {
                const teamData = await getTeams({ region })

                setTeams(teamData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [region])

    function resetFilters() {
        setSearchTerm("")
        setSelectedRole("all")
        setSelectedTeam("all")
        setMetric("points")
        setPriceCap(12000)
        setIsPerGame(false)
    }

    const filteredPlayers = players.filter(player => {
        const matchesSearch = player.player_ign
            .toLowerCase()
            .includes(searchTerm.toLowerCase())

        const matchesRole =
            selectedRole === "all" ||
            Number(player.player_role) === Number(selectedRole)

        const matchesTeam =
            selectedTeam === "all" ||
            Number(player.team_id) === Number(selectedTeam)

        const matchesPrice =
            Number(player.fantasy_price) <= Number(priceCap)

        return matchesSearch && matchesRole && matchesTeam && matchesPrice
    })

    const playersByRole = roles.map(role => {
        const rolePlayers = filteredPlayers.filter(player =>
            Number(player.player_role) === Number(role.id)
        )

        return {
            ...role,
            players: rolePlayers
        }
    })

    const metricMap = {
        points: "fantasy_points",
        kills: "total_kills",
        deaths: "total_deaths",
        assists: "total_assists",
        farm: "total_farm"
    }

    const selectedMetricField = metricMap[metric]

    function getMetricValue(player) {
        const rawValue = Number(player[selectedMetricField] ?? 0)

        if (!isPerGame) {
            return rawValue
        }

        const matchesPlayed = Number(player.matches_played)

        if (!matchesPlayed) {
            return 0
        }

        return (rawValue / matchesPlayed).toFixed(1)
    }

    if (loading) return <p>Loading player filters...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="fantasy-player-list">
            <div className="fpl-section">
                <h1>Player Selection</h1>
                <p>You can select up to two players from the same team.</p>
            </div>

            <div className="fpl-section">
                <label htmlFor="player-search">Find a player:</label>

                <input
                    id="player-search"
                    type="text"
                    placeholder="🔍 Search by IGN . . ."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="fpl-section fpl-filters">
                <select
                    name="role-filter"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                >
                    <option value="all">All Roles</option>

                    {
                        roles.map(role => (
                            <option
                                key={role.id}
                                value={role.id}
                            >
                                {role.role_code}
                            </option>
                        ))
                    }
                </select>

                <select
                    name="team-filter"
                    value={selectedTeam}
                    onChange={e => setSelectedTeam(e.target.value)}
                >
                    <option value="all">All Teams</option>

                    {
                        teams.map(team => (
                            <option
                                key={team.id}
                                value={team.id}
                            >
                                {team.team_name}
                            </option>
                        ))
                    }
                </select>

                <select
                    name="metric-selector"
                    value={metric}
                    onChange={e => setMetric(e.target.value)}
                >
                    <option value="points">Points</option>
                    <option value="kills">Kills</option>
                    <option value="deaths">Deaths</option>
                    <option value="assists">Assists</option>
                    <option value="farm">Farm</option>
                </select>

                <input
                    type="number"
                    min={0}
                    max={12000}
                    value={priceCap}
                    step={250}
                    placeholder="Set your max price ..."
                    onChange={e => setPriceCap(Number(e.target.value))}
                />

                <button
                    type="button"
                    className="filter-button"
                    onClick={() => setIsPerGame(prev => !prev)}
                >
                    {isPerGame ? "Per Game: ON" : "Per Game: OFF"}
                </button>

                <button
                    type="button"
                    className="filter-button"
                    onClick={resetFilters}
                >
                    ⟳ Reset
                </button>
            </div>

            <div className="fpl-section player-role-groups">
                {
                    playersByRole.map(role => {
                        return (selectedRole === "all" || Number(selectedRole) === Number(role.id)) && (
                            <div
                                className="player-role-group"
                                key={role.id}
                            >
                                <div className="player-role-mini-header">
                                    <h2>{role.role_name}</h2>
                                    <span>price</span>
                                    <span>{metric}</span>
                                </div>

                                <ul>
                                    {
                                        role.players.map(player => {
                                            const alreadyQueued = contractQueue.some(contract =>
                                                Number(contract.fantasy_player) === Number(player.id)
                                            )

                                            const alreadyContracted = contracts.some(contract =>
                                                Number(contract.fantasy_player) === Number(player.id)
                                            )

                                            const roleTakenQueued = contractQueue.some(contract =>
                                                Number(contract.contract_role) === Number(player.player_role)
                                            )

                                            const roleTakenContracted = contracts.some(contract =>
                                                Number(contract.contract_role) === Number(player.player_role)
                                            )

                                            const cannotAfford =
                                                Number(player.fantasy_price) > Number(remainingBudget)

                                            const isBlocked =
                                                !alreadyQueued && (
                                                    alreadyContracted ||
                                                    roleTakenQueued ||
                                                    roleTakenContracted ||
                                                    cannotAfford
                                                )

                                            return (
                                                <li
                                                    key={player.id}
                                                    className="player-list-item"
                                                >
                                                    <div className="player-main-info">
                                                        <img
                                                            className="player-headshot"
                                                            src={`${basePortraitUrl}${player.player_ign}.png`}
                                                            alt={`${player.player_ign} portrait`}
                                                        />

                                                        <div className="player-text-info">
                                                            <strong>{player.player_ign}</strong>

                                                            <div className="player-sub-info">
                                                                <span>{player.team_code}</span>
                                                                <span>{role.role_code}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <span className="player-price">
                                                    {player.fantasy_price}
                                                </span>

                                                    <span className="player-metric">
                                                    {getMetricValue(player)}
                                                </span>

                                                    <button
                                                        type="button"
                                                        className={`add-player-button ${alreadyQueued ? "is-added" : ""}`}
                                                        disabled={isBlocked}
                                                        onClick={() => onTogglePlayer(player)}
                                                    >
                                                        <span>+</span>
                                                    </button>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FantasyPlayerList