import { useState } from 'react';
import CategoryButton from './common/CategoryButton';
import Button from './common/Button';
import { FaPlus } from 'react-icons/fa6';
import AddCategoryModal from './AddCategoryModal';
import AddExpenseModal from './AddExpenseModal';
import { useExpenseContext } from './context/ExpenseProvider';
import ConfirmModal from './common/ConfirmModal';
import { MdOutlineCancel } from 'react-icons/md';

const ExpenseCategory: React.FC = () => {
	const { loading, categories, handleDeleteCategory } = useExpenseContext();
	const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const openModal = (category) => {
		setSelectedCategory(category);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedCategory(null);
	};
	const handleDelete = (category) => {
		setSelectedCategory(category.name);
		setShowModal(true);
	};
	const handleConfirm = async () => {
		await handleDeleteCategory({ categoryName: selectedCategory });
		setShowModal(false);
		setSelectedCategory(null);
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Expense Categories</h2>
			<ul role="list" className="relative  rounded-[16px] h-96 md:h-[500px] overflow-y-auto scrollbar-hidden">
				{categories.map((data) => (
					<li key={data.category?._id} className="relative flex justify-between gap-x-6 p-3 hover:bg-gray-50 ">
						<div className="flex min-w-0 gap-x-4">
							<div className="min-w-0 flex-auto">
								<p className="text-sm font-semibold leading-6 text-gray-900">{data.category.name}</p>
							</div>
						</div>
						<div className="flex shrink-0 items-center gap-x-4">
							<p className="text-sm leading-6 text-gray-900">Rs.{data.totalAmount}</p>
							<CategoryButton onClick={() => openModal(data.category)} />

							<div
								role="button"
								className="relative border flex items-end rounded-full px-3 py-1 text-sm font-medium bg-white text-primary"
								onClick={() => handleDelete(data.category)}
							>
								<div className="flex flex-col items-center">Delete</div>
							</div>
						</div>
					</li>
				))}
				<li className="sticky bottom-0 bg-gradient p-3 text-center">
					<Button
						buttonType="button"
						size="md"
						variant="filled"
						innerClass="w-50 bg-white"
						innerTextClass="text-primary"
						startIcon={<FaPlus />}
						onClick={() => setShowCategoryModal(true)}
					>
						Add new category
					</Button>
				</li>
			</ul>
			{showCategoryModal && <AddCategoryModal onClose={() => setShowCategoryModal(false)} />}
			{isModalOpen && <AddExpenseModal category={selectedCategory} closeModal={closeModal} />}

			{showModal && (
				<ConfirmModal
					modalId="delete-action-modal"
					title="Confirm Expense Category Deletion"
					message={`Deleting ${selectedCategory} category will remove all associated expenses. This action cannot be undone.`}
					confirmText={'Yes, Delete'}
					cancelText="No, Keep Category"
					onConfirm={handleConfirm}
					onCancel={() => setShowModal(false)}
					confirmDisabled={loading}
					cancelDisabled={loading}
					btnClass={'text-white bg-error-600 hover:bg-error-800 focus:ring-error-300 border-error-600'}
					icon={<MdOutlineCancel className="w-10 h-10 text-error-600" />}
				/>
			)}
		</div>
	);
};

export default ExpenseCategory;
