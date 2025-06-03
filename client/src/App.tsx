import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import InstitutionLayout from './pages/dashboards/institution/InstitutionLayout'
import InstitutionHome from './pages/dashboards/institution/InstitutionHome'
import Settings from './pages/dashboards/institution/Settings'
import ResumeAnalysis from './pages/ResumeAnalysis'
import StudentHome from './pages/dashboards/student/StudentHome'
import InterviewQuestions from './pages/InterviewQuestions'
import Analytics from './pages/dashboards/student/Analytics'
import Practice from './pages/dashboards/student/Practice'
import MockInterview from './pages/MockInterview'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student" element={<StudentHome />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/interview-questions/:interviewId" element={<InterviewQuestions />} />
          <Route path="/mock-interview/:interviewId" element={<MockInterview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/practice" element={<Practice />} />
          
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