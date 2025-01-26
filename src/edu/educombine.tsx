import React from "react";

interface ComponentProps {
  title?: string; // Optional title for the component
  onAction?: () => void; // Optional action callback
}

const SkeletonComponent: React.FC<ComponentProps> = ({ title = "Default Title", onAction }) => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <div className="text-xl font-semibold text-gray-800 mb-2">{title}</div>
      <div className="text-gray-600 mb-4">
        This is a skeleton component. Add your content here.
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Take Action
        </button>
      )}
    </div>
  );
};

export default SkeletonComponent;
