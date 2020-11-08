/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    /* Vídeo de explicação do desafio
    const { income, outcome } = this.transactions.reduce(
      (acumulador: Balance, transaction: Transaction) => {
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
    */

    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total = 0, transaction) => {
        return (total += transaction.value);
      }, 0);

    const outcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((total, transaction) => {
        return (total += transaction.value);
      }, 0);

    return { income, outcome, total: income - outcome };
  }

  public create({
    title,
    value,
    type,
  }: CreateTransactionDTO): Transaction | null {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
