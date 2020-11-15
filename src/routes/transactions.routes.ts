import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import multerConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer(multerConfig);

transactionsRouter.get('/', async (request: Request, response: Response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  return response.json({
    transactions: await transactionsRepository.FindAll(),
    balance: await transactionsRepository.getBalance(),
  });
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete(
  '/:id',
  async (request: Request, response: Response) => {
    const { id } = request.params;

    const deleteTransactionService = new DeleteTransactionService();
    await deleteTransactionService.execute({
      id,
    });

    return response.status(202).send();
  },
);

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request: Request, response: Response) => {
    const importFileTransactions = new ImportTransactionsService();
    const { file } = request;

    const ret = await importFileTransactions.execute({
      file,
    });

    return response.json(ret);
  },
);

export default transactionsRouter;
