import { useState } from 'react';
import Button from './common/Button';
import InputField from './common/InputField';
import { useExpenseContext } from './context/ExpenseProvider';

const AddCategoryModal: React.FC<any> = ({ onClose }) => {
	const [newCategory, setNewCategory] = useState<string>('');
	const [error, setError] = useState<{ newCategory?: string }>({});
	const { loading, handleAddCategory } = useExpenseContext();
	const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewCategory(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError({});

		const newError: { newCategory?: string } = {};

		if (!newCategory) {
			newError.newCategory = 'Category name is required';
		}

		if (Object.keys(newError).length > 0) {
			setError(newError);
			return;
		}

		await handleAddCategory({ categoryName: newCategory });
		setNewCategory('');
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded shadow-lg w-96">
				<h2 className="text-xl font-semibold mb-4">Add new category</h2>
				<form onSubmit={handleSubmit} noValidate>
					<InputField
						label="Category name"
						id="categoryName"
						name="categoryName"
						type="text"
						value={newCategory}
						placeholder="new category"
						required={true}
						error={error.newCategory}
						onChange={handleCategoryChange}
					/>
					<div className="flex flex-1 w-100 items-center justify-start gap-4">
						<Button buttonType="submit" size="sm" variant="filled" innerClass="w-full bg-blue-500 text-white" disabled={loading} loading={loading}>
							Add
						</Button>
						<Button buttonType="button" size="sm" variant="outline" innerClass="w-full  text-red-500" disabled={loading} onClick={onClose}>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddCategoryModal;
