import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
// import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Tipo inválido');
    }

    if (
      type === 'outcome' &&
      (await transactionRepository.getBalance()).total < value
    ) {
      throw new AppError('Saldo insuficiente');
    }

    let category_data = await categoryRepository.findOne({
      title: category.trim(),
    });

    if (!category_data) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      category_data = await categoryRepository.save(newCategory);
    }

    const newTransaction = transactionRepository.create({
      title,
      value,
      type,
      category: category_data,
    });

    await transactionRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
