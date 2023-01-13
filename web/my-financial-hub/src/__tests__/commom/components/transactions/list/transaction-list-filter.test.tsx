import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockUseGetAccounts } from '../../../../../__mocks__/hooks/accounts-page.hook';
import { MockUseGetCategories } from '../../../../../__mocks__/hooks/categories-hook';
import { CreateAccounts } from '../../../../../__mocks__/types/account-builder';
import { CreateCategories } from '../../../../../__mocks__/types/category-builder';

import { TransactionType } from '../../../../../commom/interfaces/transaction';

import TransactionListFilter from '../../../../../commom/components/transactions/list/filter/transaction-list-filter';

describe('on start', () => {
  describe('without value',() => {
    it('should set all fields as default value', () => {
      const timeout = 10;
      const accounts = CreateAccounts();
      mockUseGetAccounts(accounts,timeout);

      const categories = CreateCategories();
      MockUseGetCategories(categories,timeout);

      const { getByLabelText } = render(
        <TransactionListFilter 
          onFilter={jest.fn()} 
        />
      );

      expect(getByLabelText('Accounts')).toHaveTextContent('Select an account');
      expect(getByLabelText('Categories')).toHaveTextContent('Select a category');
      expect(getByLabelText('Start Date')).toHaveValue('');
      expect(getByLabelText('End Date')).toHaveValue('');
    });
  });
  describe('with value',() => {
    beforeEach(
      () => {
        jest.useFakeTimers('modern');
      }
    );
    afterEach(() => {
      jest.useRealTimers();
    });
    it('should set all fields as the input value', async () => {
      const timeout = 10;
      
      const accounts = CreateAccounts();
      const categories = CreateCategories();

      const filter = {
        types: [TransactionType.Earn],
        startDate: new Date(),
        endDate: new Date(),
        categories: [categories[0].id ?? ''],
        accounts: [accounts[0].id?? '']
      };
      const { getByLabelText } = render(
        <TransactionListFilter onFilter={jest.fn()} defaultFilter={filter} />
      );

      await act(
        async () => {
          jest.advanceTimersByTime(timeout + timeout + 1);
        }
      );

      expect(getByLabelText('Accounts')).toHaveTextContent(accounts[0].name);
      expect(getByLabelText('Categories')).toHaveTextContent(categories[0].name);
      expect(getByLabelText('Start Date')).toHaveValue(filter.startDate.toISOString());
      expect(getByLabelText('End Date')).toHaveValue(filter.endDate.toISOString());
    });
  });
});

describe('on submit', () => {
  //TODO: make the test by changing the fields instead of the defaultFilter prop
  it('should send all filtered values on filter', ()=>{
    const filter = {
      startDate: new Date(),
      endDate: new Date(),
      categories: ['category'],
      accounts: ['account']
    };
    const onFilter = jest.fn();
    
    const { getByText } = render(
      <TransactionListFilter
        defaultFilter={filter} 
        onFilter={onFilter} 
      />
    );
    
    act(
      ()=>{
        userEvent.click(getByText('Filter'));
      }
    );

    expect(onFilter).toBeCalledWith(filter);
  });
  it('should call "onFilter" method', ()=>{
    const filter = {};
    const onFilter = jest.fn();
    
    const { getByText } = render(
      <TransactionListFilter
        defaultFilter={filter} 
        onFilter={onFilter} 
      />
    );
    
    act(
      ()=>{
        userEvent.click(getByText('Filter'));
      }
    );

    expect(onFilter).toBeCalledTimes(1);
  });
});
