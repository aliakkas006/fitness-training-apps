import { Request, Response, NextFunction } from 'express';
import defaults from '../../../../config/defaults';
import workoutPlanService from '../../../../lib/workoutPlan';
import query from '../../../../utils/query';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  const page: number = parseInt(req.query.page as string) || defaults.page;
  const limit: number = parseInt(req.query.limit as string) || defaults.limit;
  const sortType: string = (req.query.sort_type as string) || defaults.sortType;
  const sortBy: string = (req.query.sort_by as string) || defaults.sortBy;
  const search: string = (req.query.search as string) || defaults.search;

  try {
    // data
    const workouts = await workoutPlanService.findAll({ page, limit, sortType, sortBy, search });
    const data = query.getTransformedItems({
      items: workouts,
      selection: ['id', 'name', 'mode', 'equipment', 'exercises', 'builder'],    //my selected properties
      path: '/workouts',
    });

    // pagination
    const totalItems = await workoutPlanService.count({ search });
    const pagination = query.getPagination({ totalItems, limit, page });

    // HATEOAS links
    const links = query.getHATEOASForAllItems({
      url: req.url,
      path: req.path,
      query: req.query,
      page,
      hasNext: !!pagination.next,
      hasPrev: !!pagination.prev,
    });

    // response generation
    res.status(200).json({
      data,
      pagination,
      links,
    });
  } catch (err) {
    next(err);
  }
};

export default findAll;
