import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import StudentLayout from "../layouts/StudentLayout";
import InstitutionLayout from "../layouts/InstitutionLayout";
import AdminLayout from "../layouts/AdminLayout";
import StudentHome from "../pages/dashboards/student/StudentHome";
import InstitutionHome from "../pages/dashboards/institution/InstitutionHome";
import AdminHome from "../pages/dashboards/admin/AdminHome";
import ResumeAnalysis from "../pages/ResumeAnalysis";
import InterviewQuestions from "../pages/InterviewQuestions";
import Analytics from "../pages/dashboards/student/Analytics";
import Practice from "../pages/dashboards/student/Practice";

import MockInterview from "../pages/MockInterview";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/interview-questions/:interviewId" element={<InterviewQuestions />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/resume-analysis" element={<ResumeAnalysis />} />
      <Route path="/mock-interview" element={<MockInterview />} />
      <Route path="/mock-interview/:interviewId" element={<MockInterview />} />
      <Route element={<StudentLayout />}>
        <Route path="/student/dashboard" element={<StudentHome />} />
      </Route>
      <Route element={<InstitutionLayout />}>
        <Route path="/institution/dashboard" element={<InstitutionHome />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminHome />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
