import "./ProgressRange.css";

const PrograssRange = ({ value }: { value: number }) => {
  return (
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      className="w-full h-3 bg-gray-300 rounded-full appearance-none custom-range"
      style={{
        background: `linear-gradient(to right, #FD6F00 ${value}%, #e0e0e0 0%)`,
      }}
    />
  );
};

export default PrograssRange;
