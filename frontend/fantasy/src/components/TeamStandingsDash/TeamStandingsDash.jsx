import './TeamStandingsDash.css'

const TeamStandingsDash = ({
                               seasons,
                               selectedSeason,
                               setSelectedSeason,
                               regions,
                               selectedRegion,
                               setSelectedRegion
})=>{

    return (
        <div className='team-standings-dash'>
            <select
                name="season-select"
                value={selectedSeason}
                onChange={(e)=>setSelectedSeason(Number(e.target.value))}
            >
                {seasons.map(season=> (
                    <option
                        key={season.id}
                        value={season.id}
                    >
                        {season.szn_name} {season.szn_year}
                    </option>
                ))}
            </select>

            <select
                name="region-select"
                value={selectedRegion}
                onChange={(e)=>setSelectedRegion(Number(e.target.value))}
            >
                {regions.map(region=> (
                    <option
                        key={region.id}
                        value={region.id}
                    >
                        {region.region_code}
                    </option>
                ))}
            </select>

        </div>
    )
}

export default TeamStandingsDash