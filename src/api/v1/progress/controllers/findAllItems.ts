import { Request, Response, NextFunction } from 'express';
import defaults from '../../../../config/defaults';
import progressService from '../../../../lib/progress';
import query from '../../../../utils/query';

const findAllItems = async (req: Request, res: Response, next: NextFunction) => {
  // extract the query params
  const page: number = parseInt(req.query.page as string) || defaults.page;
  const limit: number = parseInt(req.query.limit as string) || defaults.limit;
  const sortType: string = (req.query.sort_type as string) || defaults.sortType;
  const sortBy: string = (req.query.sort_by as string) || defaults.sortBy;
  const workoutId: string = (req.query.workoutId as string) || '';
  const builderId: string = (req.query.builderId as string) || '';

  try {
    // data process
    const progresses = await progressService.findAllItems({
      page,
      limit,
      sortType,
      sortBy,
      workoutId,
      builderId,
    });
    const data = query.getTransformedItems({
      items: progresses,
      selection: ['id, workoutSession', 'trackProgress', 'performance', 'builder', 'workout'],
      path: '/progress',
    });

    // pagination
    const totalItems = await progressService.count({ workoutId, builderId });
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

    // generate response
    const response = {
      data,
      pagination,
      links: {
        ...links,
        workoutPlan: `/progress?workoutId=${workoutId}`,
        builder: `/progress?builderId=${builderId}`,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default findAllItems;
