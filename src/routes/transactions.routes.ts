import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

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
  async (request: Request, response: Response) => {
    return response.json({ message: 'foi import' });
  },
);

export default transactionsRouter;
