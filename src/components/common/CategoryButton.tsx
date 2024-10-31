const CategoryButton = ({ onClick }) => {
	const getButtonClasses = () => {
		const baseClasses =
			'flex items-end rounded-full px-3 py-1 text-sm font-medium bg-white border border-primary-200 text-primary focus:ring-2 ring-[#737B8B]';
		return baseClasses;
	};

	return (
		<button type="button" className={getButtonClasses()} onClick={onClick}>
			<div className="flex flex-col items-center">Add expense</div>
		</button>
	);
};

export default CategoryButton;
