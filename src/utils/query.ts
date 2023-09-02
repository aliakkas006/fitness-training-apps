import defaults from '../config/defaults';
import generateQueryString from './qs';
import { badRequest } from './CustomError';

// Define data types
interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  next?: number;
  prev?: number;
}

interface Links {
  self: string;
  next?: string;
  prev?: string;
}

interface PaginationParam {
  totalItems?: number;
  limit?: number;
  page?: number;
}

interface HATEOASLinksParam {
  url?: string;
  path?: string;
  query?: object;
  page?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

interface TransformedItemsParam {
  items: Array<any>;
  selection?: Array<string>;
  path?: string;
}

// pagination utils
const getPagination = ({
  totalItems = defaults.totalItems,
  limit = defaults.limit,
  page = defaults.page,
}: PaginationParam) => {
  const totalPage = Math.ceil(totalItems / limit);

  const pagination: Pagination = {
    page,
    limit,
    totalItems,
    totalPage,
  };

  if (page < totalPage) {
    pagination.next = page + 1;
  }

  if (page > 1) {
    pagination.prev = page - 1;
  }

  return pagination;
};

// HATEOAS links utils
const getHATEOASForAllItems = ({
  url = '/',
  path = '',
  query = {},
  page = 1,
  hasNext = false,
  hasPrev = false,
}: HATEOASLinksParam) => {
  const links: Links = {
    self: url,
  };

  if (hasNext) {
    const queryStr = generateQueryString({ ...query, page: page + 1 });
    links.next = `${path}?${queryStr}`;
  }

  if (hasPrev) {
    const queryStr = generateQueryString({ ...query, page: page + 1 });
    links.prev = `${path}?${queryStr}`;
  }

  return links;
};

// get transformed data utils
const getTransformedItems = ({ items = [], selection = [], path = '/' }: TransformedItemsParam) => {
  if (!Array.isArray(items) || !Array.isArray(selection)) throw badRequest('Invalid Arguments!');

  if (selection.length === 0) return items.map((item) => ({ ...item, link: `${path}/${item.id}` }));

  return items.map((item) => {
    const result: any = {};
    selection.forEach((key) => {
      result[key] = item[key];
    });
    result.link = `${path}/${item.id}`;
    return result;
  });
};

export default { getPagination, getHATEOASForAllItems, getTransformedItems };
