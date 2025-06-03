import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaVideo } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Question {
  question_no: number;
  question: string;
  ideal_answer: string;
}

const InterviewQuestions: React.FC = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [interviewId]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/interview/questions/${interviewId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load interview questions');
      setLoading(false);
    }
  };

  const startMockInterview = () => {
    navigate(`/mock-interview/${interviewId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Interview Questions</h1>
            <button
              onClick={startMockInterview}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaVideo className="mr-2" />
              Start Mock Interview
            </button>
          </div>
          
          <div className="space-y-6">
            {questions.map((question) => (
              <div
                key={question.question_no}
                className="bg-white rounded-lg shadow-lg p-6 transition-all hover:shadow-xl"
              >
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-medium">
                    {question.question_no}
                  </span>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {question.question}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Sample Answer:</h4>
                      <p className="text-gray-600">
                        {question.ideal_answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InterviewQuestions; 