interface ProgressBarProps {
  progress: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "bg-blue-600",
}) => {
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
