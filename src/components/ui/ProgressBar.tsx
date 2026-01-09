interface ProgressBarProps {
  progress: number; // A number between 0 and 100
  color?: string;   // Optional custom color
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = "bg-blue-600" }) => {
  // Ensure progress stays between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className={`${color} h-full transition-all duration-500 ease-out`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;