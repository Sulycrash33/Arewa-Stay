const STEPS = ['Basics', 'Photos', 'Culture', 'Amenities', 'Pricing', 'Review'];

export default function WizardProgress({ step }: { step: number }) {
  const pct = Math.round((step / STEPS.length) * 100);
  return (
    <div className="mb-stack-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-label-md text-label-md text-on-surface-variant">
          Step {step} of {STEPS.length}: {STEPS[step - 1]}
        </span>
      </div>
      <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
        <div className="bg-primary-container h-2 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
