import Navbar from "../../components/Navbar/Navbar.jsx";
import TitleCard from "../../components/TitleCard/TitleCard.jsx";
import TeamTable from "../../components/TeamTable/TeamTable.jsx";
import TeamStandingsDash from "../../components/TeamStandingsDash/TeamStandingsDash.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import {useState, useEffect} from "react";
import {getSeasons} from "../../services/seasonService.js";
import {getRegions} from "../../services/regionService.js";


import './Standings.css'

const Standings = ()=>{

    const [seasons, setSeasons] = useState([])
    const [regions, setRegions] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [selectedSeason, setSelectedSeason] = useState(3)
    const [selectedRegion, setSelectedRegion] = useState(3)

    useEffect(() => {
        async function loadSeasons() {
            try {
                setLoading(true)
                setError(null)

                const [seasonsData, regionsData] = await Promise.all([
                        getSeasons(),
                        getRegions()
                    ]
                )

                setSeasons(seasonsData)
                setRegions(regionsData)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadSeasons()

    }, []);

    if (loading) return <p>Loading player stats...</p>
    if (error) return <p>{error}</p>

    return (
        <div className='page'>
            <Navbar />
            <TitleCard title='Standings' />

            <div className='standings-content'>

                <TeamStandingsDash
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                    regions={regions}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                />
                <TeamTable season={selectedSeason} region={selectedRegion} />
            </div>

            <Footer />
        </div>
    )
}


export default Standings