import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (title.length <= 3) {
      throw new Error('Invalid title length');
    }
    if (type !== 'income' && type !== 'outcome') {
      throw new Error('Invalid type');
    }
    if (value < 0) {
      throw new Error('Invalid value');
    }

    const balance = this.transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new Error("Invalid transaction, don't have balance");
    }
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
