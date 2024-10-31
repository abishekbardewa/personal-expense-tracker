import { useState } from 'react';
import CategoryButton from './common/CategoryButton';
import Button from './common/Button';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import AddCategoryModal from './AddCategoryModal';
import AddExpenseModal from './AddExpenseModal';
import { useExpenseContext } from './context/ExpenseProvider';
import ConfirmModal from './common/ConfirmModal';
import { MdOutlineCancel } from 'react-icons/md';
import Loader from './common/Loader';
import { formatCurrency } from '../utils';

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

	if (loading) {
		// return <Loader />;
		return;
	}

	return (
		<div>
			<div className="flex justify-between items-center  mb-5">
				<h2 className="text-2xl font-semibold leading-6 text-gray-900">Expense Categories</h2>
				<Button
					buttonType="button"
					size="md"
					variant="filled"
					innerClass="bg-white"
					innerTextClass="text-primary whitespace-nowrap"
					startIcon={<FaPlus />}
					onClick={() => setShowCategoryModal(true)}
				>
					New category
				</Button>
			</div>
			<ul role="list" className="h-[500px] overflow-y-auto scrollbar-hidden">
				{categories.map((data) => (
					<li key={data.category?._id} className=" flex flex-col justify-between gap-x-6 py-3 hover:bg-gray-50 ">
						<div className=" flex justify-between gap-x-6 py-3 ">
							<div className="flex min-w-0 gap-x-4">
								<div className="min-w-0 flex-auto">
									<p className="text-sm font-semibold leading-6 text-gray-900">{data.category.name}</p>
								</div>
							</div>
							<div className="flex shrink-0 items-center gap-x-4">
								<p className="text-sm leading-6 text-gray-900">{formatCurrency(data.totalAmount)}</p>
								<CategoryButton onClick={() => openModal(data.category)} />
								<div role="button" className="text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => handleDelete(data.category)}>
									<FaTrash className="h-5 w-5 text-red-600" />
								</div>
							</div>
						</div>
						<div>
							<div className="overflow-hidden rounded-full bg-gray-100">
								<div className="h-2 rounded-full bg-primary" style={{ width: data.percentage }}></div>
							</div>
						</div>
					</li>
				))}
			</ul>
			{showCategoryModal && <AddCategoryModal onClose={() => setShowCategoryModal(false)} />}
			{isModalOpen && <AddExpenseModal category={selectedCategory} closeModal={closeModal} />}

			{showModal && (
				<ConfirmModal
					modalId="delete-action-modal"
					title={`Confirm ${selectedCategory} Category Deletion`}
					message={`Deleting this category will remove all associated expenses. This action cannot be undone.`}
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
