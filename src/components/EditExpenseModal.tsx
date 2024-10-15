import { useEffect, useState } from 'react';
import Button from './common/Button';
import InputField from './common/InputField';
import TextAreaField from './common/TextAreaField';
import { useExpenseContext } from './context/ExpenseProvider';
import { formatDateToUTC } from '../utils';

const EditExpenseModal: React.FC<any> = ({ category, closeModal }: any) => {
	const [amount, setAmount] = useState<string>('');
	const [date, setDate] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [error, setError] = useState<{ amount?: string; date?: string }>({});
	const { loading, handleEditExpense } = useExpenseContext();

	useEffect(() => {
		if (category) {
			setAmount(category.amount);
			setDate(formatDateToUTC(category.date).split('T')[0]);
			setDescription(category.description);
		}
	}, []);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError({});

		const newError: { amount?: string; date?: string } = {};

		if (!amount) {
			newError.amount = 'Amount is required';
		}
		if (!date) {
			newError.date = 'Date is required';
		}

		if (Object.keys(newError).length > 0) {
			setError(newError);
			return;
		}

		const reqObj = { amount, date: formatDateToUTC(date), description };
		await handleEditExpense(category._id, reqObj);
		closeModal();
	};

	return (
		<div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded shadow-lg w-96">
				<h2 className="text-xl font-semibold mb-4">Edit Expense for {category?.category}</h2>
				<form onSubmit={handleSubmit} noValidate>
					<InputField
						label="Amount"
						id="amount"
						name="amount"
						type="number"
						value={amount}
						placeholder="amount"
						required={true}
						error={error.amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
					<InputField
						label="Date"
						id="date"
						name="date"
						type="date"
						value={date}
						placeholder="date"
						required={true}
						error={error.date}
						onChange={(e) => setDate(e.target.value)}
					/>
					<TextAreaField
						label="Description (Optional)"
						id="description"
						name="description"
						placeholder="Write your description"
						value={description}
						maxLength={100}
						rows={2}
						required={false}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<div className="flex flex-1 w-100 items-center justify-start gap-4">
						<Button buttonType="submit" disabled={loading} loading={loading} size="sm" variant="filled" innerClass="w-full border-primary text-white">
							Edit expense
						</Button>
						<Button buttonType="button" size="sm" variant="outline" innerClass="w-full  text-red-500" disabled={loading} onClick={closeModal}>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditExpenseModal;
