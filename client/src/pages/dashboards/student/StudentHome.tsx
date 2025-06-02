import React from "react";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import Navbar from "../../../components/Navbar";
import Logo from "../../../components/Logo";
import Footer from "../../../components/Footer";
import '../../../styles/animations.css';

const StudentHome: React.FC = () => {
  return (
    <div className="min-h-screen lex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Main content with padding for fixed navbar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-8">
              <Logo className="animate-bounce-slow" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl animate-slide-up">
              Welcome to <span className="text-indigo-600">InterviewGURU</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-delayed">
              Master your technical interviews with AI-powered practice sessions and expert guidance
            </p>
          </div>

          {/* Trusted By Section */}
          <div className="mt-16 animate-fade-in-delayed">
            <p className="text-center text-base font-semibold uppercase text-gray-600 tracking-wider">
              Trusted by top companies worldwide
            </p>
            <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <img className="h-12 opacity-50 hover:opacity-100 transition-opacity" src="/company-1.svg" alt="Company 1" />
              </div>
              {/* Add more company logos here */}
            </div>

            {/* Resume Analysis Button */}
            <div className="mt-12">
              <Link
                to="/resume-analysis"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
              >
                <FaFileAlt className="mr-2" />
                Analyze Your Resume
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                Get instant AI-powered feedback on your resume
              </p>
            </div>
          </div>

          {/* Feature Grid with Animations */}
          <div className="mt-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Practice Sessions */}
              <div className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-left">
                  <div className="h-12 w-12 rounded-md bg-indigo-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Practice Sessions</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Access hundreds of real interview questions and practice with our AI interviewer
                  </p>
                </div>
              </div>

              {/* Mock Interviews */}
              <div className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-left">
                  <div className="h-12 w-12 rounded-md bg-indigo-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Mock Interviews</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Schedule mock interviews with professional interviewers and get detailed feedback
                  </p>
                </div>
              </div>

              {/* Performance Analytics */}
              <div className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-left">
                  <div className="h-12 w-12 rounded-md bg-indigo-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Performance Analytics</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Track your progress and identify areas for improvement with detailed analytics
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="mt-32 space-y-32 max-w-7xl mx-auto">
            {/* Practice Section */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl text-center">
                  Practice Like Never Before
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Our AI-powered practice platform provides a realistic interview environment where you can:
                </p>
                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-pulse-custom">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Feedback</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Get instant feedback on your code, approach, and communication skills
                    </dd>
                  </div>
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-pulse-custom">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Extensive Question Bank</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Access thousands of real interview questions from top tech companies
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-10 -mx-4 relative lg:mt-0">
                <div className="relative space-y-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                    <pre className="text-white font-mono text-sm">
                      <code>
                        // Example Interview Question{'\n'}
                        function findMissingNumber(nums) {'{'}{'\n'}
                        {'  '}// Your solution here{'\n'}
                        {'}'}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Interviews Section */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
                <div className="relative space-y-4">
                  <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Expert Interviewers</h4>
                        <p className="text-sm text-gray-500">Experienced professionals from top tech companies</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  Mock Interviews with Industry Experts
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Practice with professionals who have experience conducting real technical interviews:
                </p>
                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-pulse-custom">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Flexible Scheduling</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Book interviews at times that work best for you
                    </dd>
                  </div>
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-pulse-custom">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Detailed Feedback</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Receive comprehensive feedback on your technical and communication skills
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  Track Your Progress
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Monitor your improvement with detailed analytics and insights:
                </p>
                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-pulse-custom">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Performance Metrics</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      View detailed statistics on your problem-solving speed and accuracy
                    </dd>
                  </div>
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white animate-pulse-custom">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Skill Assessment</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Identify your strengths and areas for improvement
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-10 -mx-4 relative lg:mt-0">
                <div className="relative space-y-4">
                  <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                    <div className="h-64 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 bg-indigo-50 rounded-2xl max-w-7xl mx-auto">
            <div className="py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block">Ready to dive in?</span>
                <span className="block text-indigo-600">Start your practice session today.</span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all"
                  >
                    Get started
                  </a>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transform hover:scale-105 transition-all"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentHome;
