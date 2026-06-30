import { getMatchesWithTeamInfo } from "../../services/matchService.js"
import { useState, useEffect } from "react"

import "./MatchTable.css"

const MatchTable = ({ season, region, ascending = true }) => {
    const [matches, setMatches] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchMatches() {
            setLoading(true)
            setError(null)

            try {
                const matchData = await getMatchesWithTeamInfo({ season, region })

                const uniqueMatches = Array.from(
                    new Map(matchData.map(match => [match.id, match])).values()
                )

                setMatches(uniqueMatches)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMatches()
    }, [season, region])

    function getDateKey(dateValue) {
        if (!dateValue) return "No date"

        if (typeof dateValue === "string") {
            return dateValue.slice(0, 10)
        }

        return new Date(dateValue).toISOString().slice(0, 10)
    }

    function formatDate(dateValue) {
        if (!dateValue || dateValue === "No date") return "No date"

        return new Date(dateValue).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }

    function getTeamLogo(teamId, teamCode) {
        return `/team_logos/${teamId}-${teamCode}.png`
    }

    const matchesByDate = Object.values(
        matches.reduce((groups, match) => {
            const date = getDateKey(match.date_played)

            if (!groups[date]) {
                groups[date] = {
                    date,
                    matches: []
                }
            }

            groups[date].matches.push(match)

            return groups
        }, {})
    ).sort((a, b) => {
        if (a.date === "No date") return 1
        if (b.date === "No date") return -1

        const dateA = new Date(a.date)
        const dateB = new Date(b.date)

        return ascending
            ? dateA - dateB
            : dateB - dateA
    })

    matchesByDate.forEach(matchDay => {
        matchDay.matches.sort((a, b) => {
            return ascending
                ? Number(a.id) - Number(b.id)
                : Number(b.id) - Number(a.id)
        })
    })

    if (loading) return <p>Loading matches...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="match-list">
            {
                matchesByDate.map(matchDay => (
                    <div
                        className="match-day-group"
                        key={matchDay.date}
                    >
                        <div className="match-day-header">
                            <h2>{formatDate(matchDay.date)}</h2>
                            <span>{matchDay.matches.length} matches</span>
                        </div>

                        <ul className="match-day-matches">
                            {
                                matchDay.matches.map(match => (
                                    <li
                                        className="match-list-item"
                                        key={match.id}
                                    >
                                        <div className="match-team match-team-home">
                                            <span>{match.home_team_name}</span>

                                            <img
                                                className="match-team-logo"
                                                src={getTeamLogo(match.home_team_id, match.home_team_code)}
                                                alt={`${match.home_team_name} logo`}
                                            />

                                            <strong>{match.home_team_wins}</strong>
                                        </div>

                                        <div className="match-center-info">
                                            <span>{match.match_format}</span>
                                        </div>

                                        <div className="match-team match-team-away">
                                            <strong>{match.away_team_wins}</strong>

                                            <img
                                                className="match-team-logo"
                                                src={getTeamLogo(match.away_team_id, match.away_team_code)}
                                                alt={`${match.away_team_name} logo`}
                                            />

                                            <span>{match.away_team_name}</span>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                ))
            }
        </div>
    )
}

export default MatchTable