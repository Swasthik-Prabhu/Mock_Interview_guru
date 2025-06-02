import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import InstitutionLayout from './pages/dashboards/institution/InstitutionLayout'
import InstitutionHome from './pages/dashboards/institution/InstitutionHome'
import Settings from './pages/dashboards/institution/Settings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Institution Routes */}
          <Route path="/institution" element={<InstitutionLayout />}>
            <Route path="dashboard" element={<InstitutionHome />} />
            <Route path="settings" element={<Settings />} />
            {/* Add more institution routes here */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App