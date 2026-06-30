import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home.jsx'
import Players from "./pages/Players/Players.jsx";
import MediaArchive from "./pages/MediaArchive/MediaArchive.jsx";
import Standings from "./pages/Standings/Standings.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Matches from "./pages/Matches/Matches.jsx";
import FantasyRoster from "./pages/FantasyRoster/FantasyRoster.jsx";
import Leagues from "./pages/Leagues/Leagues.jsx";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />

                <Route path='/players' element={<Players />} />

                <Route path='/media_archive' element={<MediaArchive />} />

                <Route path='/standings' element={<Standings />} />

                <Route path='/auth' element={<Auth />} />

                <Route path='/matches' element={<Matches />} />

                <Route path='/fantasy/roster' element={<FantasyRoster />} />

                <Route path='/fantasy/leagues' element={<Leagues />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App