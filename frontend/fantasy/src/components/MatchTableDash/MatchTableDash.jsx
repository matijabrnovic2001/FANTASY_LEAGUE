import { useState, useEffect } from "react"
import { getSeasons } from "../../services/seasonService.js"
import { getRegions } from "../../services/regionService.js"
import MatchTable from "../MatchTable/MatchTable.jsx"

import "./MatchTableDash.css"

const MatchTableDashBoard = ({
                                 selectedSeason,
                                 setSelectedSeason,
                                 selectedRegion,
                                 setSelectedRegion,
                                 ascending,
                                 setAscending
}) => {
    const [seasons, setSeasons] = useState([])
    const [regions, setRegions] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchFilters() {
            setLoading(true)
            setError(null)

            try {
                const [seasonData, regionData] = await Promise.all([
                    getSeasons(),
                    getRegions()
                ])

                setSeasons(seasonData)
                setRegions(regionData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchFilters()
    }, [])

    if (loading) return <p>Loading match filters...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="match-dashboard">
            <div className="match-dashboard-header">

                <div className="match-dashboard-controls">
                    <select
                        value={selectedSeason}
                        onChange={e => setSelectedSeason(Number(e.target.value))}
                    >
                        {
                            seasons.map(season => (
                                <option
                                    key={season.id}
                                    value={season.id}
                                >
                                    {season.szn_name} {season.szn_year}
                                </option>
                            ))
                        }
                    </select>

                    <select
                        value={selectedRegion}
                        onChange={e => setSelectedRegion(Number(e.target.value))}
                    >
                        {
                            regions.map(region => (
                                <option
                                    key={region.id}
                                    value={region.id}
                                >
                                    {region.region_name}
                                </option>
                            ))
                        }
                    </select>

                    <button
                        type="button"
                        className="filter-button"
                        onClick={() => setAscending(prev => !prev)}
                    >
                        {ascending ? "Oldest First" : "Newest First"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MatchTableDashBoard