import { Request, Response, NextFunction } from 'express';
import profileService from '../../../../lib/profile';

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, profilePic, age, height, weight, fitnessLevel, goal } =
    req.body;

  try {
    
    const profile = await profileService.create({
      firstName,
      lastName,
      email,
      profilePic,
      age,
      height,
      weight,
      fitnessLevel,
      goal,
      user: req.user,
    });

    const response = {
      code: 201,
      message: 'User Profile Created Successfully',
      data: profile,
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
