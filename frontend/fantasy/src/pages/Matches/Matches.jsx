import './Matches.css'
import Navbar from "../../components/Navbar/Navbar.jsx";
import TitleCard from "../../components/TitleCard/TitleCard.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import MatchTable from "../../components/MatchTable/MatchTable.jsx";
import MatchTableDashBoard from "../../components/MatchTableDash/MatchTableDash.jsx";
import {useState} from "react";

const Matches = ()=> {
    const [selectedSeason, setSelectedSeason] = useState(3)
    const [selectedRegion, setSelectedRegion] = useState(3)
    const [ascending, setAscending] = useState(true)

    return (
       <div className="matches-page">
           <Navbar />
           <TitleCard title='Match History' />

           <div className='match-content'>
                <MatchTableDashBoard
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    ascending={ascending}
                    setAscending={setAscending}
                />
                <MatchTable
                    region={selectedRegion}
                    season={selectedSeason}
                    ascending={ascending}
                />

           </div>

           <Footer />

       </div>
   )
}

export default Matches