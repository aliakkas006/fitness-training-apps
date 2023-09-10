import { Request, Response, NextFunction } from 'express';
import userService from '../../../../lib/user';

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role, status } = req.body;

  try {
    const user = await userService.create({
      name,
      email,
      password,
      role,
      status,
    });

    const response = {
      code: 201,
      message: 'User Created Successfully',
      data: user,
      links: {
        self: req.url,
        edit: `${req.url}/edit`,
        delete: `${req.url}/delete`,
        view: `${req.url}/view`,
      },
    };

    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

export default create;
