import { Request, Response, NextFunction } from 'express';
import userService from '../../../../lib/user';

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await userService.changePassword(id, password);
    
    const response = {
      code: 200,
      message: 'Password Changed Successfully!',
      links: {
        view: `api/v1/users/${user.id}`,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default changePassword;
