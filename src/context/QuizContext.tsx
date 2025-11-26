import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface QuizData {
  age?: string;
  eyeColor?: string;
  attractiveness?: string;
  reflection?: string;
  skinTone?: string;
  monolid?: string;
  sensitiveSkin?: string;
  skinConcerns?: string[];
  sexy?: string;
  skinType?: string;
  impression?: string;
  feelings?: string[];
  comfortableWithSexy?: string;
  faceShape?: string;
  beautySpend?: string;
  makeupSkills?: string;
  goals?: string[];
  happyGoals?: string[];
  name?: string;
  email?: string;
  selectedPrice?: string;
}

interface QuizContextType {
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizData, setQuizData] = useState<QuizData>(() => {
    try {
      const savedData = localStorage.getItem('quizData');
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('quizData', JSON.stringify(quizData));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [quizData]);

  const updateQuizData = (data: Partial<QuizData>) => {
    setQuizData((prev) => ({ ...prev, ...data }));
  };

  return (
    <QuizContext.Provider value={{ quizData, updateQuizData }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};