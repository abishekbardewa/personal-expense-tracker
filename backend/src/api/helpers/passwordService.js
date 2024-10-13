import bcrypt from "bcrypt";

const hashPassword = (password) => {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
}

const comparePassword = (password, passwordHash) => {
    const result = bcrypt.compareSync(password, passwordHash);
    return result;
}

export { hashPassword, comparePassword };