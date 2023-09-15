import defaults from '../config/defaults';
import generateQueryString from './qs';
import { badRequest } from './error';
import {
  HATEOASLinksParam,
  Links,
  Pagination,
  PaginationParam,
  TransformedItemsParam,
} from '../types/interfaces';

// Get pagination
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

// Get HATEOAS links
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

// Get transformed data
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
