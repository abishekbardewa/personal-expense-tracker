const CategoryButton = ({ onClick }) => {
	const getButtonClasses = () => {
		const baseClasses = 'relative flex items-end rounded-full px-3 py-1 text-sm font-medium bg-primary text-white';
		return baseClasses;
	};

	return (
		<button type="button" className={getButtonClasses()} onClick={onClick}>
			<div className="flex flex-col items-center">Add expense</div>
		</button>
	);
};

export default CategoryButton;
