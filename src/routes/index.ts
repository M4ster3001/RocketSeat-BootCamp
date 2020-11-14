import { Router } from 'express';
import ReqLogs from '../middleware/Logs';

import transactionsRouter from './transactions.routes';

const routes = Router();

routes.use(ReqLogs);
routes.use('/transactions', transactionsRouter);

export default routes;
