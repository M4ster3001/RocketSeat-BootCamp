/* eslint-disable no-param-reassign */
import { EntityRepository, getRepository, Repository } from 'typeorm';
import Category from '../models/Category';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { income, outcome } = (await this.find()).reduce(
      (acumulador: Balance, transaction: Transaction) => {
        transaction.value = parseFloat(
          transaction.value.toString().replace('.', ','),
        );

        switch (transaction.type) {
          case 'income':
            acumulador.income += transaction.value;
            break;
          case 'outcome':
            acumulador.outcome += transaction.value;
            break;
          default:
            break;
        }

        return acumulador;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return { income, outcome, total: income - outcome };
  }

  public async FindAll(): Promise<Omit<Transaction, 'category_id'>[]> {
    const categoryRepository = getRepository(Category);

    const transactions = await Promise.all(
      (await this.find()).map(
        async (
          transaction: Transaction,
        ): Promise<Omit<Transaction, 'category_id'>> => {
          const category_data = await categoryRepository.findOne({
            id: transaction.category_id,
          });

          return {
            id: transaction.id,
            title: transaction.title,
            type: transaction.type,
            value: transaction.value,
            category: category_data,
            created_at: transaction.created_at,
            updated_at: transaction.updated_at,
          };
        },
      ),
    );

    return transactions;
  }
}

export default TransactionsRepository;
