import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  if (!password || !hashedPassword) {
    throw new Error("Password and hashed password are required");
  }
  return await bcrypt.compare(password, hashedPassword);
};
