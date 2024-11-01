import React from 'react';

interface ProgressBarProps {
	progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
	return <div className="absolute top-0 left-0 w-full h-2 bg-primary" style={{ width: `${progress}%` }} />;
};

export default ProgressBar;
