import React, { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  text: string;
  highlightPosition: {
    topPercentage: number;
    leftPercentage: number;
    widthPercentage: number;
    heightPercentage?: number;
  };
}

const TutorialOverlay: React.FC = () => {
  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: '"bottom bar is scrollable"',
      text: 'horizontally scrolll to get more options , also a there is three dashed icon to open the bigger navigation bar for ease and also to logout',
      highlightPosition: {
        topPercentage: 80,
        leftPercentage: 10,
        widthPercentage: 120,
        heightPercentage: 20
      }
    },
    // {
    //   id: 2,
    //   title: 'Feature Exploration',
    //   text: 'This innovative feature will revolutionize how you interact with the application.',
    //   highlightPosition: {
    //     topPercentage: 50,
    //     leftPercentage: 25,
    //     widthPercentage: 50,
    //     heightPercentage: 20
    //   }
    // },
    // {
    //   id: 3,
    //   title: 'Mastering the App',
    //   text: 'Congratulations! You\'ve now gained comprehensive insights into our application\'s core functionalities.',
    //   highlightPosition: {
    //     topPercentage: 70,
    //     leftPercentage: 5,
    //     widthPercentage: 90,
    //     heightPercentage: 15
    //   }
    // }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(false);

  const saveTutorialProgress = useCallback((step: number, completed: boolean) => {
    localStorage.setItem('tutorialProgress', JSON.stringify({
      currentStep: step,
      completed: completed
    }));
  }, []);

  useEffect(() => {
    const tutorialProgress = localStorage.getItem('tutorialProgress');
    if (tutorialProgress) {
      const parsedProgress = JSON.parse(tutorialProgress);
      setCurrentStep(parsedProgress.currentStep || 0);
      setIsTutorialCompleted(parsedProgress.completed || false);
    }
  }, []);

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep < tutorialSteps.length) {
      setCurrentStep(nextStep);
      saveTutorialProgress(nextStep, false);
    } else {
      completeTutorial();
    }
  };

  const handlePreviousStep = () => {
    const prevStep = Math.max(0, currentStep - 1);
    setCurrentStep(prevStep);
    saveTutorialProgress(prevStep, false);
  };

  const completeTutorial = () => {
    setIsTutorialCompleted(true);
    saveTutorialProgress(tutorialSteps.length - 1, true);
  };

  const restartTutorial = () => {
    setCurrentStep(0);
    setIsTutorialCompleted(false);
    localStorage.removeItem('tutorialProgress');
  };

  const currentStepData = tutorialSteps[currentStep];

  if (isTutorialCompleted) {
    return (
      <button 
        onClick={restartTutorial}
        className="fixed top-4 left-4 z-50 p-3 rounded-full bg-blue-500 text-white"
      >
        <RefreshCw size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-11/12 max-w-xl p-6 rounded-xl shadow-lg">
        <div className="flex justify-end mb-4">
          <button 
            onClick={completeTutorial}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-700">{currentStepData.text}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
          {currentStep > 0 && (
            <button 
              onClick={handlePreviousStep}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="mr-2" /> Previous
            </button>
          )}
          
          <button 
            onClick={handleNextStep}
            className={`
              flex items-center 
              ${currentStep === tutorialSteps.length - 1 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
              } 
              text-white px-4 py-2 rounded-md
            `}
          >
            {currentStep === tutorialSteps.length - 1 
              ? <><CheckCircle className="mr-2" /> Finish</>
              : <>Next <ChevronRight className="ml-2" /></>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;