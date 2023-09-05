interface Config {
  totalItems: number;
  limit: number;
  page: number;
  sortType: string;
  sortBy: string;
  search: string;
  algorithm: string;
  expiresIn: string
}

const config: Config = {
  totalItems: 0,
  limit: 10,
  page: 1,
  sortType: 'dsc',
  sortBy: 'updatedAt',
  search: '',
  algorithm: 'HS256',
  expiresIn: '1h'
};

export default Object.freeze(config);
