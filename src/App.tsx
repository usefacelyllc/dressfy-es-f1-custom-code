
import React, { useState } from 'react';
import MakefyQuizPage from './components/MakefyQuizPage';
import AgeQuizPage from './components/AgeQuizPage';
import EyeColorQuizPage from './components/EyeColorQuizPage';
import AttractivenessQuizPage from './components/AttractivenessQuizPage';
import CheckpointPage from './components/CheckpointPage';
import SkinToneQuizPage from './components/SkinToneQuizPage';
import MonolidQuizPage from './components/MonolidQuizPage';
import SensitiveSkinQuizPage from './components/SensitiveSkinQuizPage';
import SkinConcernsQuizPage from './components/SkinConcernsQuizPage';
import ReflectionQuizPage from './components/ReflectionQuizPage';
import SexyQuizPage from './components/SexyQuizPage';
import PossibilityCheckpointPage from './components/PossibilityCheckpointPage';
import SkinTypeQuizPage from './components/SkinTypeQuizPage';
import ImpressionQuizPage from './components/ImpressionQuizPage';
import FeelingsQuizPage from './components/FeelingsQuizPage';
import ComfortableWithSexyQuizPage from './components/ComfortableWithSexyQuizPage';
import FaceShapeQuizPage from './components/FaceShapeQuizPage';
import BeautySpendQuizPage from './components/BeautySpendQuizPage';
import EarlyPossibilityCheckpointPage from './components/EarlyPossibilityCheckpointPage';
import PersonalizeExperiencePage from './components/PersonalizeExperiencePage';
import CameraAnalysisPage from './components/CameraAnalysisPage';
import ResultsReadyPage from './components/ResultsReadyPage';
import MakeupSkillsQuizPage from './components/MakeupSkillsQuizPage';
import GoalsQuizPage from './components/GoalsQuizPage';
import HappyGoalsQuizPage from './components/HappyGoalsQuizPage';
import BeautifulSelfCheckpointPage from './components/BeautifulSelfCheckpointPage';
import NameInputPage from './components/NameInputPage';
import AnalysisPage from './components/AnalysisPage';
import EmailInputPage from './components/EmailInputPage';
import FinalResultsPage from './components/FinalResultsPage';
import PricingPage from './components/PricingPage';
import CheckoutPage from './components/CheckoutPage';
import UpsellPage from './components/UpsellPage';
import ThankYouPage from './components/ThankYouPage';
import { QuizProvider } from './context/QuizContext';

type Page = 
  | 'home' 
  | 'ageQuiz' 
  | 'eyeColorQuiz' 
  | 'attractivenessQuiz' 
  | 'reflectionQuiz' 
  | 'skinToneQuiz' 
  | 'faceShapeQuiz'
  | 'monolidQuiz' 
  | 'sensitiveSkinQuiz' 
  | 'skinConcernsQuiz' 
  | 'checkpoint'
  | 'sexyQuiz'
  | 'possibilityCheckpoint'
  | 'earlyPossibilityCheckpoint'
  | 'skinTypeQuiz'
  | 'impressionQuiz'
  | 'feelingsQuiz'
  | 'comfortableWithSexyQuiz'
  | 'beautySpendQuiz'
  | 'personalizeExperience'
  | 'cameraAnalysis'
  | 'resultsReady'
  | 'makeupSkillsQuiz'
  | 'goalsQuiz'
  | 'happyGoalsQuiz'
  | 'beautifulSelfCheckpoint'
  | 'nameInput'
  | 'analysis'
  | 'emailInput'
  | 'finalResults'
  | 'pricing'
  | 'checkout'
  | 'upsell'
  | 'thankYou';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const goToPage = (page: Page) => setCurrentPage(page);

  const renderPage = () => {
    switch (currentPage) {
      // First Block (8 questions)
      case 'ageQuiz':
        return <AgeQuizPage onBack={() => goToPage('home')} onContinue={() => goToPage('eyeColorQuiz')} />;
      case 'eyeColorQuiz':
        return <EyeColorQuizPage onBack={() => goToPage('ageQuiz')} onContinue={() => goToPage('attractivenessQuiz')} />;
      case 'attractivenessQuiz':
        return <AttractivenessQuizPage onBack={() => goToPage('eyeColorQuiz')} onContinue={() => goToPage('reflectionQuiz')} />;
      case 'reflectionQuiz':
        return <ReflectionQuizPage onBack={() => goToPage('attractivenessQuiz')} onContinue={() => goToPage('skinToneQuiz')} />;
      case 'skinToneQuiz':
        return <SkinToneQuizPage onBack={() => goToPage('reflectionQuiz')} onContinue={() => goToPage('monolidQuiz')} />;
      case 'monolidQuiz':
        return <MonolidQuizPage onBack={() => goToPage('skinToneQuiz')} onContinue={() => goToPage('sensitiveSkinQuiz')} />;
      case 'sensitiveSkinQuiz':
        return <SensitiveSkinQuizPage onBack={() => goToPage('monolidQuiz')} onContinue={() => goToPage('skinConcernsQuiz')} />;
      case 'skinConcernsQuiz':
        return <SkinConcernsQuizPage onBack={() => goToPage('sensitiveSkinQuiz')} onContinue={() => goToPage('checkpoint')} />;
      
      // Checkpoint 1
      case 'checkpoint':
        return <CheckpointPage onContinue={() => goToPage('sexyQuiz')} />;

      // Intermediate Question
      case 'sexyQuiz':
        return <SexyQuizPage onBack={() => goToPage('checkpoint')} onContinue={() => goToPage('earlyPossibilityCheckpoint')} />;

      // New Early Checkpoint
      case 'earlyPossibilityCheckpoint':
        return <EarlyPossibilityCheckpointPage onContinue={() => goToPage('skinTypeQuiz')} />;

      // Final Block
      case 'skinTypeQuiz':
        return <SkinTypeQuizPage onBack={() => goToPage('sexyQuiz')} onContinue={() => goToPage('impressionQuiz')} />;
      case 'impressionQuiz':
        return <ImpressionQuizPage onBack={() => goToPage('skinTypeQuiz')} onContinue={() => goToPage('feelingsQuiz')} />;
      case 'feelingsQuiz':
        return <FeelingsQuizPage onBack={() => goToPage('impressionQuiz')} onContinue={() => goToPage('comfortableWithSexyQuiz')} />;
      case 'comfortableWithSexyQuiz':
        return <ComfortableWithSexyQuizPage onBack={() => goToPage('feelingsQuiz')} onContinue={() => goToPage('possibilityCheckpoint')} />;
      
      // Moved Checkpoint 2
      case 'possibilityCheckpoint':
        return <PossibilityCheckpointPage onContinue={() => goToPage('faceShapeQuiz')} />;

      case 'faceShapeQuiz':
        return <FaceShapeQuizPage onBack={() => goToPage('possibilityCheckpoint')} onContinue={() => goToPage('beautySpendQuiz')} />;
      case 'beautySpendQuiz':
        return <BeautySpendQuizPage onBack={() => goToPage('faceShapeQuiz')} onContinue={() => goToPage('personalizeExperience')} />;
      
      // Personalization Step
      case 'personalizeExperience':
        return <PersonalizeExperiencePage 
                  onBack={() => goToPage('beautySpendQuiz')} 
                  onContinue={() => goToPage('cameraAnalysis')} 
                  onSkip={() => goToPage('resultsReady')}
               />;

      // Camera Analysis
      case 'cameraAnalysis':
        return <CameraAnalysisPage 
                  onBack={() => goToPage('personalizeExperience')}
                  onContinue={() => goToPage('resultsReady')}
               />;

      // Results Ready
      case 'resultsReady':
        return <ResultsReadyPage onContinue={() => goToPage('makeupSkillsQuiz')} />;

      // Makeup Skills
      case 'makeupSkillsQuiz':
        return <MakeupSkillsQuizPage 
                  onBack={() => goToPage('resultsReady')} 
                  onContinue={() => goToPage('goalsQuiz')} 
               />;
      
      // Goals Quiz
      case 'goalsQuiz':
        return <GoalsQuizPage 
                  onBack={() => goToPage('makeupSkillsQuiz')} 
                  onContinue={() => goToPage('happyGoalsQuiz')} 
               />;

      // Happy Goals Quiz
      case 'happyGoalsQuiz':
        return <HappyGoalsQuizPage 
                  onBack={() => goToPage('goalsQuiz')} 
                  onContinue={() => goToPage('beautifulSelfCheckpoint')} 
               />;

      // Beautiful Self Checkpoint
      case 'beautifulSelfCheckpoint':
        return <BeautifulSelfCheckpointPage 
                  onContinue={() => goToPage('nameInput')} 
               />;

      // New Post-Quiz Flow
      case 'nameInput':
        return <NameInputPage onBack={() => goToPage('beautifulSelfCheckpoint')} onContinue={() => goToPage('analysis')} />;
      case 'analysis':
        return <AnalysisPage onComplete={() => goToPage('emailInput')} />;
      case 'emailInput':
        return <EmailInputPage onBack={() => goToPage('nameInput')} onContinue={() => goToPage('finalResults')} />;

      case 'finalResults':
        return <FinalResultsPage onContinue={() => goToPage('pricing')} />;

      // Pricing Flow: Pricing -> Checkout -> Upsell -> ThankYou
      case 'pricing':
        return <PricingPage onContinue={(price) => {
          setSelectedPrice(price);
          goToPage('checkout');
        }} />;

      case 'checkout':
        return <CheckoutPage 
          onBack={() => goToPage('pricing')} 
          selectedPrice={selectedPrice} 
          onSuccess={() => goToPage('upsell')} 
        />;
      
      // Upsell Page
      case 'upsell':
        return <UpsellPage 
           onAccept={() => {
             console.log('Upsell Accepted');
             goToPage('thankYou');
           }}
           onSkip={() => {
             console.log('Upsell Skipped');
             goToPage('thankYou');
           }}
        />;
      
      // Thank You Page
      case 'thankYou':
        return <ThankYouPage onHome={() => goToPage('home')} />;

      case 'home':
      default:
        return <MakefyQuizPage onContinue={() => goToPage('ageQuiz')} />;
    }
  };

  return (
    <QuizProvider>
      <main>
        {renderPage()}
      </main>
    </QuizProvider>
  );
};

export default App;
