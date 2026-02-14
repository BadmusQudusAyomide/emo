import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ChooseType from './pages/ChooseType'
import Create from './pages/Create'
import Preview from './pages/Preview'
import ViewPage from './pages/ViewPage'

function App() {
  return (
    <Router>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/choose-type" element={<ChooseType />} />
          <Route path="/create/:type" element={<Create />} />
          <Route path="/preview/:slug" element={<Preview />} />
          <Route path="/view/:slug" element={<ViewPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
