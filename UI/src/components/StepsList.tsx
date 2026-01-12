import { Step } from "./Step";
import { cn } from "../lib/cn";

export interface StepData {
  title: string;
  delay?: number;
  completed: boolean;
  failed?: boolean;
}

interface StepsListProps {
  steps: StepData[];
  onEditStep?: (stepTitle: string) => void;
}

export function StepsList({ steps, onEditStep }: StepsListProps) {
  return (
    <div className="w-full flex flex-col">
      <h3 className={cn(
        "flex flex-col font-['Raleway',sans-serif] font-semibold h-[33px] justify-center leading-[0] text-[20px] mb-4",
        "text-black"
      )}>
        <p className="leading-[normal]">Steps</p>
      </h3>

      {/* Steps List */}
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            delay={step.delay}
            completed={step.completed}
            failed={step.failed}
            onEdit={() => onEditStep?.(step.title)}
          />
        ))}
      </div>
    </div>
  );
}