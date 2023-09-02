import bcrypt from 'bcryptjs';

export const generateHash = async (payload: string, saltRound = 10): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRound);
  return bcrypt.hash(payload, salt);
};

export const hashMatched = async (raw: string, hash: string) => await bcrypt.compare(raw, hash);
