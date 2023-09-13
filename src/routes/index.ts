import { Router } from 'express';
import publicRouter from './public';
import privateRouter from './private';
import adminRouter from './admin';

const router = Router();
router.use([publicRouter, privateRouter, adminRouter]);

export default router;
