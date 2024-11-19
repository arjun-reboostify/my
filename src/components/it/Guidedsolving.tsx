import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Side from './Sidebar'

const GuidedProblemSolver: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState('');
  const [solutionSteps, setSolutionSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});
  const [conclusion, setConclusion] = useState('');

  const problemSteps = [
    'Watch instructional video',
    'Attempt the problem',
    'Review solution',
    'Reflect on learning'
  ];

  const handleSolutionSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && solution.trim() !== '') {
      setSolutionSteps(prev => [...prev, solution.trim()]);
      setSolution('');
    }
  };

  const toggleStepCompletion = (step: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  return (<>
  <Side />
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Guided Problem Solving
      </h2>

      {/* Question Textarea */}
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
          Problem Question
        </label>
        <textarea 
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={4}
          placeholder="Enter the problem or question here..."
        />
      </div>

      {/* Solution Input */}
      <div>
        <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
          Enter Solution Steps
        </label>
        <input 
          type="text"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          onKeyDown={handleSolutionSubmit}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Type a solution step and press Enter"
        />
      </div>

      {/* Problem Solving Checklist */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Problem Solving Checklist
        </h3>
        {problemSteps.map((step) => (
          <div 
            key={step} 
            className="flex items-center space-x-2 mb-2 cursor-pointer"
            onClick={() => toggleStepCompletion(step)}
          >
            <input 
              type="checkbox"
              checked={completedSteps[step] || false}
              onChange={() => toggleStepCompletion(step)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className={`${completedSteps[step] ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              {step}
            </span>
            {completedSteps[step] && <Check className="text-green-500" size={16} />}
          </div>
        ))}
      </div>

      {/* Solution Steps List */}
      {solutionSteps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            My Solution Steps
          </h3>
          <ul className="space-y-2 bg-gray-50 p-4 rounded-md">
            {solutionSteps.map((step, index) => (
              <li 
                key={index} 
                className="text-gray-700 bg-white p-2 rounded-md shadow-sm"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conclusion Textarea */}
      <div>
        <label htmlFor="conclusion" className="block text-sm font-medium text-gray-700">
          Problem Solving Reflection
        </label>
        <textarea 
          id="conclusion"
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={4}
          placeholder="Reflect on your problem-solving process, what you learned, and any challenges you faced..."
        />
      </div>
    </div>
    </>
  );
};

export default GuidedProblemSolver;