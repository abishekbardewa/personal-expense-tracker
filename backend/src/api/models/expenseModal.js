import mongoose from 'mongoose';
import db from '../../database/index.js';

const expenseSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		amount: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			trim: true,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

const Expense = db.model('Expense', expenseSchema);

export default Expense;
