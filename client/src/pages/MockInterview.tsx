import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaVideo, FaMicrophone, FaStop, FaPlay, FaEye, FaEyeSlash, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Navbar from '../components/Navbar';

interface Question {
  question_no: number;
  question: string;
  ideal_answer: string;
}

const MockInterview: React.FC = () => {
  const { interviewId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);
  const [timer, setTimer] = useState(0);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    // Fetch questions when component mounts
    fetchQuestions();
  }, [interviewId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/interview/questions/${interviewId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const startRecording = () => {
    if (!videoStream) return;

    const mediaRecorder = new MediaRecorder(videoStream);
    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);
    setIsRecording(true);
    setTimer(0);
    setFeedback(null);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      setFeedback(null);
      setTimer(0);
      setRecordedChunks([]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-140 py-60">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Mock Interview</h1>

          {/* Video Interface */}
          <div className="mb-8">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {!videoStream ? (
                      <button
                        onClick={startVideo}
                        className="text-white hover:text-indigo-400 transition-colors"
                      >
                        <FaVideo className="w-6 h-6" />
                      </button>
                    ) : !isRecording ? (
                      <button
                        onClick={startRecording}
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        <FaPlay className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <FaStop className="w-6 h-6" />
                      </button>
                    )}
                    <FaMicrophone className={`w-6 h-6 ${isRecording ? 'text-red-500' : 'text-white'}`} />
                  </div>
                  <div className="text-white font-mono">
                    {formatTime(timer)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          {questions.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showAnswer ? (
                    <>
                      <FaEyeSlash className="mr-2" />
                      Hide Answer
                    </>
                  ) : (
                    <>
                      <FaEye className="mr-2" />
                      Show Answer
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-xl font-medium mb-4">
                {questions[currentQuestionIndex].question}
              </h3>

              {showAnswer && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Ideal Answer:</h4>
                  <p className="text-gray-700">
                    {questions[currentQuestionIndex].ideal_answer}
                  </p>
                </div>
              )}

              {/* Feedback Buttons */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setFeedback('good')}
                    className={`flex items-center px-4 py-2 rounded-full ${
                      feedback === 'good'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaThumbsUp className="mr-2" />
                    I Did Well
                  </button>
                  <button
                    onClick={() => setFeedback('bad')}
                    className={`flex items-center px-4 py-2 rounded-full ${
                      feedback === 'bad'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaThumbsDown className="mr-2" />
                    Need Practice
                  </button>
                </div>

                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Question
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview; 