import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ChooseType from './pages/ChooseType'
import Create from './pages/Create'
import Preview from './pages/Preview'
import ViewPage from './pages/ViewPage'
import AnonymousCreate from './pages/AnonymousCreate'
import AnonymousSend from './pages/AnonymousSend'
import AnonymousInbox from './pages/AnonymousInbox'

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
          <Route path="/anonymous" element={<AnonymousCreate />} />
          <Route path="/anonymous/:slug" element={<AnonymousSend />} />
          <Route path="/anonymous/:slug/inbox" element={<AnonymousInbox />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
