import { getTeams, getRoster } from "../../services/teamService.js"
import { getRegions } from "../../services/regionService.js"
import { getSeasons } from "../../services/seasonService.js"
import { createMatch } from "../../services/matchService.js"
import { createStat } from "../../services/statService.js"
import { useState, useEffect } from "react"

import "./MatchAdminPanel.css"

const MatchAdminPanel = () => {
    const [teams, setTeams] = useState([])
    const [regions, setRegions] = useState([])
    const [seasons, setSeasons] = useState([])

    const [selectedRegion, setSelectedRegion] = useState(3)
    const [selectedSeason, setSelectedSeason] = useState("")
    const [homeTeam, setHomeTeam] = useState("")
    const [awayTeam, setAwayTeam] = useState("")

    const [homeTeamWins, setHomeTeamWins] = useState(0)
    const [awayTeamWins, setAwayTeamWins] = useState(0)
    const [matchFormat, setMatchFormat] = useState("BO3")
    const [datePlayed, setDatePlayed] = useState("")

    const [playerStats, setPlayerStats] = useState({})
    const [createdMatchId, setCreatedMatchId] = useState(null)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        async function fetchBaseData() {
            setError(null)
            setLoading(true)

            try {
                const [regionData, seasonData] = await Promise.all([
                    getRegions(),
                    getSeasons()
                ])

                setRegions(regionData)
                setSeasons(seasonData)

                if (seasonData.length > 0) {
                    setSelectedSeason(seasonData[0].id)
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchBaseData()
    }, [])

    useEffect(() => {
        async function fetchTeams() {
            setError(null)
            setLoading(true)

            try {
                const teamData = await getTeams({region: selectedRegion})

                const teamsWithRostersData = await Promise.all(
                    teamData.map(async team => {
                        const teamRosterData = await getRoster({team: team.id})

                        return {
                            ...team,
                            roster: teamRosterData
                        }
                    })
                )

                setTeams(teamsWithRostersData)

                if (teamsWithRostersData.length > 0) {
                    setHomeTeam(teamsWithRostersData[0].id)
                    setAwayTeam(teamsWithRostersData[1]?.id || "")
                }

                setPlayerStats({})
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTeams()
    }, [selectedRegion])

    function handlePlayerStatChange(playerId, field, value) {
        setPlayerStats(prev => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                [field]: value
            }
        }))
    }

    function getPlayerPortrait(playerIgn) {
        return `/player_portraits/${playerIgn}.png`
    }

    function getTeamLogo(team) {
        if (!team) return ""

        return `/team_logos/${team.id}-${team.team_code}.png`
    }

    function getStatValue(playerId, field) {
        return Number(playerStats[playerId]?.[field] || 0)
    }

    function renderPlayerStats(teamRoster = []) {
        return teamRoster.map(player => (
            <div className="player-stat-row" key={player.player_id}>
                <div className="player-stat-name">
                    <img
                        src={getPlayerPortrait(player.player_ign)}
                        alt={player.player_ign}
                        onError={e => e.currentTarget.style.display = "none"}
                    />

                    <span>{player.player_ign}</span>
                </div>

                <input
                    type="number"
                    min="0"
                    value={playerStats[player.player_id]?.kills || ""}
                    onChange={e => handlePlayerStatChange(player.player_id, "kills", e.target.value)}
                    placeholder="K"
                />

                <input
                    type="number"
                    min="0"
                    value={playerStats[player.player_id]?.deaths || ""}
                    onChange={e => handlePlayerStatChange(player.player_id, "deaths", e.target.value)}
                    placeholder="D"
                />

                <input
                    type="number"
                    min="0"
                    value={playerStats[player.player_id]?.assists || ""}
                    onChange={e => handlePlayerStatChange(player.player_id, "assists", e.target.value)}
                    placeholder="A"
                />

                <input
                    type="number"
                    min="0"
                    value={playerStats[player.player_id]?.farm || ""}
                    onChange={e => handlePlayerStatChange(player.player_id, "farm", e.target.value)}
                    placeholder="CS"
                />

                <input
                    type="number"
                    min="0"
                    value={playerStats[player.player_id]?.obj || ""}
                    onChange={e => handlePlayerStatChange(player.player_id, "obj", e.target.value)}
                    placeholder="OBJ"
                />
            </div>
        ))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setCreatedMatchId(null)

        if (Number(homeTeam) === Number(awayTeam)) {
            setError("Home team and away team cannot be the same.")
            return
        }

        const homeRoster = selectedHomeTeam?.roster || []
        const awayRoster = selectedAwayTeam?.roster || []
        const matchRoster = [...homeRoster, ...awayRoster]

        if (matchRoster.length !== 10) {
            setError("Both teams must have 5 active players before creating match stats.")
            return
        }

        const matchPayload = {
            home_team: Number(homeTeam),
            away_team: Number(awayTeam),
            season: Number(selectedSeason),
            region: Number(selectedRegion),
            date_played: datePlayed,
            home_team_wins: Number(homeTeamWins),
            away_team_wins: Number(awayTeamWins),
            match_format: matchFormat
        }

        try {
            setSubmitting(true)

            const matchData = await createMatch(matchPayload)
            const matchId = matchData.id

            await Promise.all(
                matchRoster.map(player => (
                    createStat({
                        player: Number(player.player_id),
                        for_match: Number(matchId),
                        kills: getStatValue(player.player_id, "kills"),
                        deaths: getStatValue(player.player_id, "deaths"),
                        assists: getStatValue(player.player_id, "assists"),
                        farm: getStatValue(player.player_id, "farm"),
                        obj: getStatValue(player.player_id, "obj")
                    })
                ))
            )

            setCreatedMatchId(matchId)
            setPlayerStats({})
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const selectedHomeTeam = teams.find(team => Number(team.id) === Number(homeTeam))
    const selectedAwayTeam = teams.find(team => Number(team.id) === Number(awayTeam))

    if (loading) return <p className="mod-panel-status">Loading match data...</p>
    if (error) return <p className="mod-panel-error">{error}</p>

    return (
        <form className="match-admin-panel-container" onSubmit={handleSubmit}>
            <div className="mod-import-header">
                <div className="mini-title-container">
                    <h3>Matches</h3>
                    <p>Insert a match and all player stats related with it</p>
                </div>

                <button
                    className="mod-panel-action-button"
                    disabled={submitting}
                >
                        {submitting ? "Submitting..." : "Submit Match"}
                </button>

            </div>

            <div className="first-filter-container">
                <label>
                    <span>Region</span>
                    <select
                        value={selectedRegion}
                        onChange={e => setSelectedRegion(Number(e.target.value))}
                    >
                        {regions.map(region => (
                            <option key={region.id} value={region.id}>
                                {region.region_code}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Season</span>
                    <select
                        value={selectedSeason}
                        onChange={e => setSelectedSeason(e.target.value)}
                    >
                        {seasons.map(season => (
                            <option key={season.id} value={season.id}>
                                {season.szn_name} {season.szn_year}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Date played</span>
                    <input
                        type="date"
                        value={datePlayed}
                        onChange={e => setDatePlayed(e.target.value)}
                        required
                    />
                </label>
            </div>

            <div className="match-input-container">
                <div className="match-team-select match-team-select-home">
                    <span>Home Team</span>

                    <div className="match-team-select-inner">
                        {selectedHomeTeam && (
                            <img
                                src={getTeamLogo(selectedHomeTeam)}
                                alt={selectedHomeTeam.team_code}
                                onError={e => e.currentTarget.style.display = "none"}
                            />
                        )}

                        <select
                            value={homeTeam}
                            onChange={e => setHomeTeam(e.target.value)}
                        >
                            {teams.filter(team=> Number(team.id)!==Number(awayTeam))
                                  .map(team=>(
                                      <option
                                          key={team.id}
                                          value={team.id}
                                      >
                                          {team.team_code}

                                      </option>
                                  ))

                            }
                        </select>
                    </div>
                </div>

                <div className="match-score-box">
                    <div className="match-score-control">
                        <span>Wins</span>

                        <input
                            type="number"
                            min="0"
                            value={homeTeamWins}
                            onChange={e => setHomeTeamWins(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div className="match-format-control">
                        <span>Format</span>

                        <select
                            value={matchFormat}
                            onChange={e => setMatchFormat(e.target.value)}
                        >
                            <option value="BO1">BO1</option>
                            <option value="BO3">BO3</option>
                            <option value="BO5">BO5</option>
                        </select>
                    </div>

                    <div className="match-score-control">
                        <span>Wins</span>

                        <input
                            type="number"
                            min="0"
                            value={awayTeamWins}
                            onChange={e => setAwayTeamWins(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="match-team-select match-team-select-away">
                    <span>Away Team</span>

                    <div className="match-team-select-inner match-team-select-inner-away">
                        <select
                            value={awayTeam}
                            onChange={e => setAwayTeam(e.target.value)}
                        >
                            {teams
                                .filter(team => Number(team.id) !== Number(homeTeam))
                                .map(team => (
                                    <option key={team.id} value={team.id}>
                                        {team.team_code}
                                    </option>
                                ))}
                        </select>

                        {selectedAwayTeam && (
                            <img
                                src={getTeamLogo(selectedAwayTeam)}
                                alt={selectedAwayTeam.team_code}
                                onError={e => e.currentTarget.style.display = "none"}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="match-stats-container">
                <div className="team-stats-panel">
                    <div className="team-stats-title">
                        {selectedHomeTeam && (
                            <img
                                src={getTeamLogo(selectedHomeTeam)}
                                alt={selectedHomeTeam.team_code}
                                onError={e => e.currentTarget.style.display = "none"}
                            />
                        )}

                        <h4>{selectedHomeTeam?.team_name || "Home Team"}</h4>
                    </div>

                    <div className="player-stat-header">
                        <span>Player</span>
                        <span>K</span>
                        <span>D</span>
                        <span>A</span>
                        <span>CS</span>
                        <span>OBJ</span>
                    </div>

                    {renderPlayerStats(selectedHomeTeam?.roster)}
                </div>

                <div className="team-stats-panel">
                    <div className="team-stats-title">
                        {selectedAwayTeam && (
                            <img
                                src={getTeamLogo(selectedAwayTeam)}
                                alt={selectedAwayTeam.team_code}
                                onError={e => e.currentTarget.style.display = "none"}
                            />
                        )}

                        <h4>{selectedAwayTeam?.team_name || "Away Team"}</h4>
                    </div>

                    <div className="player-stat-header">
                        <span>Player</span>
                        <span>K</span>
                        <span>D</span>
                        <span>A</span>
                        <span>CS</span>
                        <span>OBJ</span>
                    </div>

                    {renderPlayerStats(selectedAwayTeam?.roster)}
                </div>
            </div>

            {createdMatchId && (
                <p className="mod-panel-success">
                    Match and player stats created successfully. Match ID: {createdMatchId}
                </p>
            )}


        </form>
    )
}

export default MatchAdminPanel