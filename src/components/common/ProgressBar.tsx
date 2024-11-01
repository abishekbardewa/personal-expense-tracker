import React from 'react';

const ProgressBar: React.FC<any> = () => {
	return (
		<div className="absolute top-0 left-0 w-full h-[5px] bg-gray-100">
			<div className="progress-bar-inner"></div>
		</div>
	);
};

export default ProgressBar;
