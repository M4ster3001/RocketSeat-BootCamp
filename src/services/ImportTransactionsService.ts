import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, In } from 'typeorm';
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
      skip_empty_lines: true,
      trim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const transactions: TransactionFile[] = [];
    const transactionsFile: Transaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      transactions.push({ title, type, value, category });
      categories.push(category);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const categoriesExists = await categoryRepository.find({
      where: { title: In(categories) },
    });

    const categoriesExistsTitle = categoriesExists.map(
      (category: Category) => category.title,
    );

    const newCategories = categories
      .filter(category => !categoriesExistsTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const addedCategories = categoryRepository.create(
      newCategories.map(title => ({ title })),
    );

    await categoryRepository.save(addedCategories);

    const finalCategories = [...addedCategories, ...categoriesExists];

    const newTransactions = transactionRepository.create(
      transactions.map(({ title, type, value, category: tr_category }) => ({
        title,
        type,
        value,
        category: finalCategories.find(
          category => category.title === tr_category,
        ),
      })),
    );

    await transactionRepository.save(newTransactions);

    await fs.promises.unlink(file.path);

    return newTransactions;
  }
}

export default ImportTransactionsService;
