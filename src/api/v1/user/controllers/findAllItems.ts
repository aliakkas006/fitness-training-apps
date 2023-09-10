import { Request, Response, NextFunction } from 'express';
import defaults from '../../../../config/defaults';
import userService from '../../../../lib/user';
import query from '../../../../utils/query';

const findAllItems = async (req: Request, res: Response, next: NextFunction) => {
  // extract query params
  const page = parseInt(req.query.page as string) || defaults.page;
  const limit = parseInt(req.query.limit as string) || defaults.limit;
  const sortType = (req.query.sort_type as string) || defaults.sortType;
  const sortBy = (req.query.sort_by as string) || defaults.sortBy;
  const name = (req.query.name as string) || '';
  const email = (req.query.email as string) || '';

  try {
    // data process
    const users = await userService.findAllItems({ page, limit, sortType, sortBy, name, email });
    const data = query.getTransformedItems({
      items: users,
      selection: ['id', 'name', 'email', 'updatedAt', 'createdAt'],
      path: '/users',
    });

    // pagination
    const totalItems = await userService.count({ name, email });
    const pagination = query.getPagination({ totalItems, limit, page });

    // HATEOAS Links
    const links = query.getHATEOASForAllItems({
      url: req.url,
      path: req.path,
      query: req.query,
      hasNext: !!pagination.next,
      hasPrev: !!pagination.prev,
      page,
    });

    // generate response
    res.status(200).json({
      data,
      pagination,
      links,
    });
  } catch (e) {
    next(e);
  }
};

export default findAllItems;
