import { Router } from 'express';
import transactionRouter from './transaction.routes';
import logs from '../middleware/Logs';

const routes = Router();

routes.use(logs);
routes.use('/transactions', transactionRouter);

export default routes;
