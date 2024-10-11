import React from 'react';
import { LuLoader2 } from 'react-icons/lu';

const Loader = () => {
	return (
		<div className="flex items-center justify-center space-x-2 h-screen">
			<LuLoader2 className="w-6 h-6 text-primary animate-spin" />
		</div>
	);
};

export default Loader;
