import { getCustomRepository, getRepository } from 'typeorm';
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

    let category_data = await categoryRepository.findOne({ title: category });

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
