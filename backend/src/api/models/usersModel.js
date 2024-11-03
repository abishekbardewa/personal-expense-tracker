import mongoose from 'mongoose';
import db from '../../database/index.js';

const userSchema = new mongoose.Schema({
	name: { type: String },
	email: { type: String },
	password: { type: String },
	categories: [{ name: String, createdAt: { type: Date, default: Date.now } }],
});

const Users = db.model('users', userSchema);

export default Users;
