import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FaChartLine, FaCheckCircle, FaClock, FaStar, FaCode, FaLightbulb } from 'react-icons/fa';

const performanceData = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 78 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 90 },
  { month: 'Jun', score: 88 },
];

const skillsData = [
  { name: 'Problem Solving', value: 85 },
  { name: 'Data Structures', value: 78 },
  { name: 'Algorithms', value: 82 },
  { name: 'System Design', value: 70 },
];

const practiceStats = [
  { name: 'Easy', completed: 45, total: 60 },
  { name: 'Medium', completed: 30, total: 50 },
  { name: 'Hard', completed: 15, total: 30 },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-110">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="mt-2 text-gray-600">Track your progress and identify areas for improvement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Average Score"
            value="85%"
            icon={<FaChartLine />}
            trend="+5%"
            color="bg-indigo-500"
          />
          <StatCard
            title="Problems Solved"
            value="90"
            icon={<FaCheckCircle />}
            trend="+12"
            color="bg-green-500"
          />
          <StatCard
            title="Practice Time"
            value="45h"
            icon={<FaClock />}
            trend="+2h"
            color="bg-yellow-500"
          />
          <StatCard
            title="Current Streak"
            value="7 days"
            icon={<FaStar />}
            trend="Best: 15"
            color="bg-purple-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4F46E5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Skills Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {skillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Practice Progress */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-lg font-semibold mb-6">Practice Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {practiceStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{stat.name}</span>
                  <span className="text-sm text-gray-500">
                    {stat.completed}/{stat.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${(stat.completed / stat.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Insights */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-6">Recent Insights</h3>
          <div className="space-y-4">
            <InsightCard
              icon={<FaLightbulb className="text-yellow-500" />}
              title="Strong in Algorithm Design"
              description="Your performance in algorithm-based questions has improved by 15% this month."
            />
            <InsightCard
              icon={<FaCode className="text-indigo-500" />}
              title="Practice Recommendation"
              description="Focus more on system design questions to improve your overall performance."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} text-white`}>
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <span className="text-sm font-medium text-green-600">{trend}</span>
    </div>
  </div>
);

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
    <div className="flex-shrink-0">
      <div className="p-3 bg-white rounded-full shadow-sm">
        {icon}
      </div>
    </div>
    <div>
      <h4 className="text-base font-medium text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

export default Analytics; 