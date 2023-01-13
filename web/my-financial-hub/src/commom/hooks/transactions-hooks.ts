import { TransactionFilter } from '../components/transactions/list/types/transaction-filter';

import TransactionApi, { FetchTransactions } from '../http/transaction-api';
import { Transaction } from '../interfaces/transaction';

export async function UseCreateTransaction(transaction: Transaction, api: TransactionApi) : Promise<Transaction> {
  try {
    const result = await api.PostAsync(transaction);
    return result.data;
  } catch (error) {
    console.error(error);
    return Promise.reject();
  }
}

export async function UseUpdateTransaction(transaction: Transaction, api: TransactionApi) {
  try {
    if(transaction.id){
      await api.PutAsync(transaction.id,transaction);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function UseGetTransactions(filter?: TransactionFilter): Promise<Transaction[]> {
  try {
    const transactionsResult = await FetchTransactions(filter);
    return transactionsResult.data;
  } catch (error) {
    console.error(error);
    return Promise.reject();
  }
}

export async function UseDeleteTransaction(id: string, transactionsApi: TransactionApi) {
  try {
    await transactionsApi.DeleteAsync(id);
  } catch (error) {
    console.error(error);
  }
}