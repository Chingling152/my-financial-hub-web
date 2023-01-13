import { createContext, useContext } from 'react';

import AccountApi from '../../commom/http/account-api';
import CategoryApi from '../../commom/http/category-api';
import TransactionApi from '../../commom/http/transaction-api';
import { CreateApi } from '../http/api-builder';

import { Account } from '../../commom/interfaces/account';
import { Category } from '../../commom/interfaces/category';
import { Transaction } from '../../commom/interfaces/transaction';

type ApisContext = {
  accountsApi?: AccountApi,
  categoriesApi?: CategoryApi,
  transactionsApi?: TransactionApi,
};

const defaultContext = {
  accountsApi:      CreateApi<Account>(),
  categoriesApi:    CreateApi<Category>(),
  transactionsApi:  CreateApi<Transaction>()
} as ApisContext;

export function MockUseApiContext(mockContext: ApisContext): ApisContext{
  const finalContext = {
    accountsApi:      mockContext.accountsApi     ?? defaultContext.accountsApi,
    categoriesApi:    mockContext.categoriesApi   ?? defaultContext.categoriesApi,
    transactionsApi:  mockContext.transactionsApi ?? defaultContext.transactionsApi
  };
  
  const context = useContext(
    createContext<ApisContext>(finalContext)
  );

  if (context === undefined) {
    throw new Error('useApisContext must be used within a ApisContextProvider');
  }

  return context;
}
