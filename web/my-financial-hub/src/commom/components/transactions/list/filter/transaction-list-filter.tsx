import { useState } from 'react';

import { useApisContext } from '../../../../contexts/api-context';

import { TransactionFilter } from '../types/transaction-filter';
import { TransactionType } from '../../../../interfaces/transaction';

import HttpFormSelect from '../../../forms/form-select/http-form-select';
import EnumFormSelect from '../../../forms/form-select/enum-form-select';

interface ITransactionListFilterProps {
  defaultFilter?: TransactionFilter,
  onFilter: (filter: TransactionFilter) => void
}

export default function TransactionListFilter({defaultFilter = {} , onFilter }: ITransactionListFilterProps) {
  const [filter, setFilters] = useState<TransactionFilter>(defaultFilter);

  const { accountsApi, categoriesApi } = useApisContext();

  return (
    <div>
      <h3>Filters</h3>
      <form onSubmit={
        (e) => {
          e.preventDefault();
          onFilter(filter);
        }
      }>
        <div>
          <label htmlFor='transaction-filter__accounts'>Accounts</label>
          <HttpFormSelect
            api={accountsApi}
            id='transaction-filter__accounts'
            placeholder='Select an account'
            disabled={false}
            value={filter?.accounts?.[0]}
            onChangeOption={
              (selectedOption) => {
                if (selectedOption?.value) {
                  setFilters({
                    ...filter,
                    accounts: [
                      selectedOption?.value
                    ]
                  });
                }else{
                  setFilters({
                    ...filter,
                    accounts: []
                  });
                }
              }
            }
          />
        </div>

        <div>
          <label htmlFor='transaction-filter__categories'>Categories</label>
          <HttpFormSelect
            id='transaction-filter__categories'
            api={categoriesApi}
            placeholder='Select a category'
            value={filter?.categories?.[0]}
            disabled={false}
            onChangeOption={
              (selectedOption) => {
                if (selectedOption?.value) {
                  setFilters({
                    ...filter,
                    categories: [
                      selectedOption?.value
                    ]
                  });
                }else{
                  setFilters({
                    ...filter,
                    categories: []
                  });
                }
              }
            }
          />
        </div>

        <div>
          <label>Type</label>
          <EnumFormSelect
            options={TransactionType}
            placeholder='Select a type'
            disabled={true}
            onChangeOption={
              (selectedOption) => {
                if (selectedOption) {
                  console.log(selectedOption);
                  setFilters({
                    ...filter,
                    types: [
                      selectedOption
                    ]
                  });
                }else{
                  setFilters({
                    ...filter,
                    types: []
                  });
                }
              }
            }
          />
        </div>

        <div>
          <label htmlFor='transaction-filter__startDate'>Start Date</label>
          <input
            id='transaction-filter__startDate'
            title='startDate'
            type='date'
            value={filter.startDate?.toISOString()}
            onChange={
              (e) => {
                setFilters({
                  ...filter,
                  startDate: new Date(Date.parse(e.target.value))
                });
              }
            }
          />
        </div>

        <div>
          <label htmlFor='transaction-filter__endDate'>End Date</label>
          <input
            id='transaction-filter__endDate'
            title='endDate'
            type='date'
            value={filter.endDate?.toISOString()}
            onChange={
              (e) => {
                setFilters({
                  ...filter,
                  endDate: new Date(Date.parse(e.target.value))
                });
              }
            }
          />
        </div>

        <button type='submit'>Filter</button>
      </form>
    </div>
  );
}