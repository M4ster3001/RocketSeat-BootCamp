import { Request, Response, NextFunction } from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

const transactionsRepository = new TransactionsRepository();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Validate(request: Request, response: Response, next: NextFunction) {
  const { title, type, value } = request.body;

  const transaction = new Transaction({ title, value, type });

  console.log(transactionsRepository.getBalance());

  if (
    type === 'outcome' &&
    transactionsRepository.getBalance().income < value
  ) {
    return response.status(400).json({ error: 'Sem saldo' });
  }

  return next();
}

export default Validate;
