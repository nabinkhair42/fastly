import jwt from 'jsonwebtoken';

export const generateJwtToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
