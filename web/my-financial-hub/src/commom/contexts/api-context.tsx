import { createContext, useContext } from 'react';

import AccountApi from '../http/account-api';
import CategoryApi from '../http/category-api';
import TransactionApi from '../http/transaction-api';

type ApisContext = {
  accountsApi: AccountApi,
  categoriesApi: CategoryApi,
  transactionsApi: TransactionApi,
};

type ApiContextProps = { 
  children?: JSX.Element | JSX.Element[],
  context?: ApisContext
}

const defaultContext = {
  accountsApi:    new AccountApi(),
  categoriesApi:  new CategoryApi(),
  transactionsApi:  new TransactionApi()
} as ApisContext;

const ApisContext = createContext<ApisContext>(defaultContext);

//EXPORT
export function ApisContextProvider({ children, context = defaultContext }: ApiContextProps) {
  return (
    <ApisContext.Provider value={context}>
      {children}
    </ApisContext.Provider>
  );
}

export function useApisContext(): ApisContext{
  const context = useContext(ApisContext);

  if (context === undefined) {
    throw new Error('useApisContext must be used within a ApisContextProvider');
  }
  return context;
}
