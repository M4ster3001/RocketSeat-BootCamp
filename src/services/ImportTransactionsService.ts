import csvParse from 'csv-parse';
import fs from 'fs';
import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface RequestDTO {
  file: Express.Multer.File;
}

interface TransactionFile {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ file }: RequestDTO): Promise<Transaction[] | void> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);
    const readCSVStream = fs.createReadStream(file.path);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const transactionsFile: Transaction[] = [];

    parseCSV.on('data', async line => {
      let category_data = await categoryRepository.findOne({
        title: line[3].trim(),
      });

      if (!category_data) {
        const newCategory = categoryRepository.create({
          title: line[3],
        });

        category_data = await categoryRepository.save(newCategory);
      }

      const newTransaction = transactionRepository.create({
        title: line[0],
        type: line[1],
        value: line[2],
        category: category_data,
      });

      const ret = await transactionRepository.save(newTransaction);

      transactionsFile.push(ret);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    await fs.promises.unlink(file.path);

    return transactionsFile;
  }
}

export default ImportTransactionsService;
