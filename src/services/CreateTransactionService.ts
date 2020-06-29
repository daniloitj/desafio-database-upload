// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { getCustomRepository, getRepository } from "typeorm";
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if( type === "outcome" && total < value){
      throw new AppError("You do not have enough balance");
    }

    let new_category = await categoriesRepository.findOne({
      where: {
        title: category,
      }
    });

    if(!new_category){
      new_category = categoriesRepository.create({
        title: category,
      })
      await categoriesRepository.save(new_category)
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: new_category,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
