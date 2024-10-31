import { useExpenseContext } from './context/ExpenseProvider';
import EmptyState from './common/EmptyState';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import ConfirmModal from './common/ConfirmModal';
import { MdOutlineCancel } from 'react-icons/md';
import EditExpenseModal from './EditExpenseModal';
import { formatCurrency, formatDate } from '../utils';
import Loader from './common/Loader';
import Pagination from './common/Pagination';

const ExpenseTable: React.FC = () => {
	const { loading, paginationLoading, expenses, handleDeleteExpense, totalCount, paginatedExpenses, fetchPaginatedExpenses } = useExpenseContext();
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<any>({});
	const [page, setPage] = useState(1);
	const limit = 10;
	useEffect(() => {
		fetchPaginatedExpenses(page, limit);
	}, [page]);
	const handleDelete = (record: any) => {
		setSelectedRecord(record);
		setShowModal(true);
	};

	const handleConfirm = async () => {
		await handleDeleteExpense(selectedRecord._id);
		setShowModal(false);
		setSelectedRecord({});
	};
	const handleEdit = (record: any) => {
		setSelectedRecord(record);
		setShowEditModal(true);
	};

	if (loading) {
		return;
		// return <Loader />;
	}

	return (
		<div>
			<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Expense Entries</h2>
			<div className="min-w-full align-middle  bg-white rounded-[16px]  h-[500px] overflow-y-auto overflow-x-auto  scrollbar-hidden">
				{paginationLoading ? (
					<Loader />
				) : paginatedExpenses && paginatedExpenses.length > 0 ? (
					<table className="min-w-full divide-y divide-gray-300">
						<thead className="bg-gray-100">
							<tr>
								<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
									Category
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
									Added date
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Amount
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{paginatedExpenses.map((expense, idx) => (
								<tr key={`${expense.category}-${idx}`}>
									<td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
										{expense.category}
										{expense.description && <p className="mt-1   text-xs leading-5 text-gray-500">{expense.description}</p>}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(expense.date)}</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(expense.amount)}</td>

									<td className="whitespace-nowrap  px-3 py-5 text-right text-sm font-medium sm:pr-0 ">
										<div className="flex item-center  gap-4">
											<div role="button" className="text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => handleEdit(expense)}>
												<FaPenToSquare className="h-5 w-5 text-primary" />
											</div>
											<div role="button" className="text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => handleDelete(expense)}>
												<FaTrash className="h-5 w-5 text-red-600" />
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<EmptyState title="No expenses recorded yet." subtitle="Start adding your expenses to monitor your financial activity." />
				)}
			</div>
			<div className="mt-5">
				<Pagination totalCount={totalCount} page={page} limit={limit} onPageChange={setPage} pageClass={'justify-end'} />
			</div>

			{showModal && (
				<ConfirmModal
					modalId="delete-action-modal"
					title="Confirm Expense Record Deletion"
					message={`Are you sure you want to delete this expense record? This action cannot be undone and will permanently remove the record from your table.`}
					confirmText={'Yes, Delete'}
					cancelText="No, Keep Record"
					onConfirm={handleConfirm}
					onCancel={() => setShowModal(false)}
					confirmDisabled={paginationLoading}
					cancelDisabled={paginationLoading}
					btnClass={'text-white bg-error-600 hover:bg-error-800 focus:ring-error-300 border-error-600'}
					icon={<MdOutlineCancel className="w-10 h-10 text-error-600" />}
				/>
			)}
			{showEditModal && <EditExpenseModal category={selectedRecord} closeModal={() => setShowEditModal(false)} />}
		</div>
	);
};

export default ExpenseTable;
