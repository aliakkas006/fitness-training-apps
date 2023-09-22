import { Config } from '../types/interfaces';

const config: Config = {
  totalItems: 0,
  limit: 10,
  page: 1,
  sortType: 'dsc',
  sortBy: 'updatedAt',
  search: '',
  algorithm: 'HS256',
  expiresIn: '3h',
};

export default Object.freeze(config);
