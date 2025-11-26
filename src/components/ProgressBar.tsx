import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  activeSection: number; // 1-based index for sections (e.g., 1, 2, 3, 4)
  totalSections?: number; // Default is 4
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, activeSection, totalSections = 4 }) => {
  return (
    <div className="flex gap-1.5 mb-10 w-full">
      {Array.from({ length: totalSections }).map((_, index) => {
        const sectionNumber = index + 1;
        let width = '0%';

        if (sectionNumber < activeSection) {
          width = '100%';
        } else if (sectionNumber === activeSection) {
          // Calculate percentage for current section
          const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
          width = `${percentage}%`;
        }

        return (
          <div
            key={index}
            className="h-1.5 flex-1 rounded-full bg-secundaria overflow-hidden"
          >
            <div 
              className="h-full bg-principal transition-all duration-500 ease-out" 
              style={{ width }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;