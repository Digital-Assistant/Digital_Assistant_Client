import { useState, useEffect } from "react";
import { Layout } from "./Layout";
import { SearchResults } from "./SearchResults";
import { StartRecording } from "./StartRecording";
import { Countdown } from "./Countdown";
import { RecordingScreen } from "./RecordingScreen";
import { StepEditor } from "./StepEditor";
import { SavingProgress } from "./SavingProgress";
import { LoginScreen } from "./LoginScreen";
import { useAuth } from "../contexts/AuthContext";

type RecordingState = 'idle' | 'start' | 'countdown' | 'recording' | 'stepEditor' | 'saving';

interface CompletedStep {
  number: number;
  title: string;
}

export default function HomePageUser() {
  const { isAuthenticated } = useAuth();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);

  const handleRecClick = () => {
    setRecordingState('start');
  };

  const handleStart = () => {
    setRecordingState('countdown');
    setCountdown(3);
  };

  const handleContainerClick = () => {
    setRecordingState('stepEditor');
  };

  const handleCloseStepEditor = () => {
    setRecordingState('recording');
  };

  const handleSaveStep = (stepData: any) => {
    // Add completed step
    setCompletedSteps([...completedSteps, {
      number: stepData.number,
      title: stepData.title
    }]);
    
    // Move to next step
    setCurrentStep(currentStep + 1);
    
    // Stay in step editor for next step
    // Or you can go back to recording: setRecordingState('recording');
  };

  const handleFinalSave = () => {
    // Trigger saving progress
    setRecordingState('saving');
  };

  const handleCancel = () => {
    // Navigate back to search results
    setRecordingState('idle');
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  const handleSavingComplete = () => {
    // Reset to initial state
    setRecordingState('idle');
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  // Countdown timer effect
  useEffect(() => {
    if (recordingState === 'countdown') {
      if (countdown > 1) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // When countdown reaches 1, wait 1 second then show recording screen
        const timer = setTimeout(() => {
          setRecordingState('recording');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [recordingState, countdown]);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout showSearchBar={false}>
        <LoginScreen />
      </Layout>
    );
  }

  return (
    <Layout onRecClick={handleRecClick}>
      {recordingState === 'idle' && <SearchResults />}
      {recordingState === 'start' && <StartRecording onStart={handleStart} onCancel={handleCancel} />}
      {recordingState === 'countdown' && <Countdown count={countdown} />}
      {recordingState === 'recording' && <RecordingScreen onContainerClick={handleContainerClick} onCancel={handleCancel} />}
      {recordingState === 'stepEditor' && (
        <StepEditor 
          onClose={handleCloseStepEditor} 
          stepNumber={currentStep}
          completedSteps={completedSteps}
          onSaveStep={handleSaveStep}
          onFinalSave={handleFinalSave}
          onCancel={handleCancel}
        />
      )}
      {recordingState === 'saving' && (
        <SavingProgress 
          totalSteps={completedSteps.length}
          onComplete={handleSavingComplete}
        />
      )}
    </Layout>
  );
}