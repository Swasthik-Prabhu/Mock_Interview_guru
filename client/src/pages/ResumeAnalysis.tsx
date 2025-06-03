import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFileAlt, FaCheckCircle, FaTimesCircle, FaTrash, FaChevronDown, FaChevronRight, FaEye } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface FileWithPreview extends File {
  preview?: string;
}

interface Resume {
  interview_id: string;
  filename: string;
  upload_date: string;
  status: string;
}

const ResumeAnalysis: React.FC = () => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing resumes when component mounts
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/interview/resumes');
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus('idle');
      setAnalysis(null); // Reset analysis when new file is selected
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('http://localhost:8000/api/interview/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Resume upload failed');
      }

      const result = await response.json();
      
      // Store interview_id in localStorage
      localStorage.setItem('currentInterviewId', result.interview_id);
      
      // Fetch analysis for the uploaded resume
      const analysisResponse = await fetch(`http://localhost:8000/api/interview/analysis/${result.interview_id}`);
      if (!analysisResponse.ok) {
        throw new Error('Failed to fetch analysis');
      }
      
      const analysisResult = await analysisResponse.json();
      setAnalysis(analysisResult);
      setUploadStatus('success');
      
      // Refresh the resumes list
      fetchResumes();
    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploadStatus('error');
    }
  };

  const handleCancel = () => {
    setFile(null);
    setUploadStatus('idle');
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewQuestions = async (interviewId: string) => {
    try {
      // Fetch analysis for the selected resume
      const analysisResponse = await fetch(`http://localhost:8000/api/interview/analysis/${interviewId}`);
      if (!analysisResponse.ok) {
        throw new Error('Failed to fetch analysis');
      }
      
      const analysisResult = await analysisResponse.json();
      setAnalysis(analysisResult);
      
      localStorage.setItem('currentInterviewId', interviewId);
      navigate(`/interview-questions/${interviewId}`);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Resume Analysis</h1>
          <p className="text-gray-600 text-center mb-12">
            Upload your resume and get instant AI-powered analysis and improvement suggestions
          </p>

          {/* File Upload Area */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-dashed border-gray-300">
              <div className="space-y-6">
                {!file ? (
                  <div className="text-center">
                    <div className="flex flex-col items-center justify-center cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}>
                      <FaCloudUploadAlt className="w-16 h-16 text-indigo-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Click to upload your resume</h3>
                      <p className="text-sm text-gray-500">PDF files only</p>
                    </div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Selected File Info */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FaFileAlt className="w-8 h-8 text-indigo-500" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCancel}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpload}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Upload & Analyze
                      </button>
                    </div>
                  </div>
                )}

                {/* Status Messages */}
                {uploadStatus === 'uploading' && (
                  <div className="flex items-center justify-center text-indigo-600">
                    <FaCloudUploadAlt className="animate-bounce mr-2" />
                    <span>Uploading resume...</span>
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="flex items-center justify-center text-red-600">
                    <FaTimesCircle className="mr-2" />
                    <span>Upload failed. Please try again.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My Resumes Accordion */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              >
                <h3 className="text-lg font-medium">My Resumes</h3>
                {isAccordionOpen ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              
              {isAccordionOpen && (
                <div className="p-6">
                  {resumes.length === 0 ? (
                    <p className="text-gray-500 text-center">No resumes uploaded yet</p>
                  ) : (
                    <div className="space-y-4">
                      {resumes.map((resume) => (
                        <div
                          key={resume.interview_id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{resume.filename}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded on {new Date(resume.upload_date).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleViewQuestions(resume.interview_id)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            <FaEye className="mr-2" />
                            Look into
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && uploadStatus === 'success' && (
            <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
              
              {/* Skills Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Skills Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.skills?.map((skill: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <span>{skill.name}</span>
                      <span className="text-indigo-600 font-medium">
                        {skill.level}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Improvement Suggestions</h3>
                <ul className="space-y-3">
                  {analysis.suggestions?.map((suggestion: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-gray-700"
                    >
                      <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Score */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-indigo-100">
                  <span className="text-3xl font-bold text-indigo-600">
                    {analysis.score}/100
                  </span>
                </div>
                <p className="mt-4 text-gray-600">Overall Resume Score</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResumeAnalysis; 