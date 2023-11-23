import { Request, Response, NextFunction } from 'express';
import defaults from '../../../../config/defaults';
import query from '../../../../utils/query';
import profileService from '../../../../lib/profile';

const findAllItems = async (req: Request, res: Response, next: NextFunction) => {
  // extract query params
  const page = parseInt(req.query.page as string) || defaults.page;
  const limit = parseInt(req.query.limit as string) || defaults.limit;
  const sortType = (req.query.sort_type as string) || defaults.sortType;
  const sortBy = (req.query.sort_by as string) || defaults.sortBy;
  const firstName = (req.query.firstName as string) || '';
  const lastName = (req.query.lastName as string) || '';
  const email = (req.query.lastName as string) || '';

  try {
    // data process
    const profiles = await profileService.findAllItems({
      page,
      limit,
      sortType,
      sortBy,
      firstName,
      lastName,
      email,
    });

    const data = query.getTransformedItems({
      items: profiles,
      selection: [
        'id',
        'firstName',
        'lastName',
        'email',
        'avatar',
        'age',
        'height',
        'weight',
        'fitnessLevel',
        'goal',
        'user',
      ],
      path: '/profiles',
    });

    // pagination
    const totalItems = await profileService.count({ firstName, lastName });
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

    // send response
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
