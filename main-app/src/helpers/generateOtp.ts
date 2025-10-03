export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateOtpExpiration = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};
