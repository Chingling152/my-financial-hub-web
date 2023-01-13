import { TransactionType } from '../../../../interfaces/transaction';

export type TransactionFilter = {
  types?: TransactionType[],
  startDate?: Date,
  endDate?: Date,
  categories?: string[],
  accounts?: string[]
};