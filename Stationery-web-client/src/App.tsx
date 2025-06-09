import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './page/Sidebar'
import RacerList from './page/RacerList'
import RaceList from './page/RaceList'
import DirectorList from './page/DirectorList'
import LicenseList from './page/LicenseList'
import SponsorList from './page/SponsorList'
import ParticipatesList from './page/ParticipatesList'

function App() {
  return (
    <BrowserRouter>
      <div className='flex'>
        <Sidebar />
        <div className='flex-1'>
          <Routes>
            <Route path='/racers' element={<RacerList />} />
            <Route path='/races' element={<RaceList />} />
            <Route path='/directors' element={<DirectorList />} />
            <Route path='/licenses' element={<LicenseList />} />
            <Route path='/sponsors' element={<SponsorList />} />
            <Route path='/participates' element={<ParticipatesList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
