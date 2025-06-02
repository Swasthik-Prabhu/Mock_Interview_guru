import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the performance graph
const performanceData = [
  { month: 'Jan', students: 65 },
  { month: 'Feb', students: 72 },
  { month: 'Mar', students: 80 },
  { month: 'Apr', students: 78 },
  { month: 'May', students: 85 },
  { month: 'Jun', students: 90 },
];

const InstitutionHome: React.FC = () => {
  return (
    <main className="p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value="25,569"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Teachers"
          value="7,500"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Schools"
          value="512"
          color="bg-orange-500"
        />
        <StatCard
          title="Total Budget"
          value="৳ 51,9500"
          color="bg-green-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Student Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <EventCard
              title="Annual Meeting"
              date="July 15, 2024"
              time="10:00 AM"
              duration="2h"
            />
            <EventCard
              title="Teacher Training"
              date="July 20, 2024"
              time="09:00 AM"
              duration="3h"
            />
            <EventCard
              title="Parent Meeting"
              date="July 25, 2024"
              time="11:00 AM"
              duration="1.5h"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className={`${color} rounded-lg p-6 text-white`}>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  duration: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, time, duration }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium">{time}</p>
      <p className="text-sm text-gray-500">{duration}</p>
    </div>
  </div>
);

export default InstitutionHome;
