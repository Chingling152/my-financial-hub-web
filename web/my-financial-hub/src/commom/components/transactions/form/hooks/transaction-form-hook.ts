import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useApisContext } from '../../../../contexts/api-context';
import { UseCreateTransaction, UseUpdateTransaction } from '../../../../hooks/transactions-hooks';

import { defaultTransaction, Transaction, TransactionStatus } from '../../../../interfaces/transaction';
import ValidationError from '../../../../interfaces/validation-error';
import ValidateTransaction from '../../../../validators/transaction-validator';
import SelectOption from '../../../forms/form-select/types/select-option';

type TransactionValidationResult = {
  type: ValidationError,
  amount: ValidationError,
  accountId: ValidationError,
  categoryId: ValidationError,
  targetDate: ValidationError,
  finishDate: ValidationError
}

interface ITransactionFormHook {
  changeField: (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void,
  changeAmount: (event: ChangeEvent<HTMLInputElement>) => void,
  changeCategory: (option?: SelectOption) => void,
  changeAccount: (option?: SelectOption) => void,
  changeType: (type? : number) => void,
  toggleIsPaid: () => void,

  submitTransaction: (event: FormEvent<HTMLFormElement>) => Promise<void>,

  isLoading: boolean,
  transaction: Transaction,

  errors?: TransactionValidationResult
}

interface ITransactionFormHookProps {
  formData: Transaction,
  onSubmit?: (transaction: Transaction) => void //TODO: UseCallback
}

export function UseTransactionForm(
  {
    formData = defaultTransaction,
    onSubmit
  } : ITransactionFormHookProps
)   : ITransactionFormHook{
  const { transactionsApi } = useApisContext();
  const [ transaction, setTransaction ] = useState<Transaction>(formData);
  const [ isLoading, setLoading ] = useState(false);
  const [ errors, setErrors ] = useState<TransactionValidationResult>();

  const submitTransaction = async function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const result = ValidateTransaction(transaction);
    const hasErrorResult = 
      result.accountId.hasError  || result.amount.hasError || 
      result.categoryId.hasError || result.finishDate.hasError || 
      result.targetDate.hasError || result.type.hasError;
    
    if(!hasErrorResult){
      let tra: Transaction;
      
      if (transaction.id) {
        await UseUpdateTransaction(transaction,transactionsApi);
        tra = transaction;
      } else {
        tra = await UseCreateTransaction(transaction,transactionsApi);
      }
  
      onSubmit?.(tra);
      setTransaction(defaultTransaction); 
    }else{
      setErrors(result);
    }

    setLoading(false);
  };

  const changeField = function(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) : void{
    const { name, value } = event.target;
    setTransaction({
      ...transaction,
      [name]: value
    });
  };

  const changeAmount = function(event: ChangeEvent<HTMLInputElement>) : void{
    setTransaction({
      ...transaction,
      amount: parseFloat(event.target.value)
    });
  };

  const changeType = function (type? : number) : void{
    if(type){
      setTransaction({
        ...transaction,
        type
      });
    }
  };

  //TODO: join changeCategory with changeAccount
  const changeCategory = function (option?: SelectOption) : void{
    if(option?.value){
      setTransaction({
        ...transaction,
        categoryId: option?.value
      });
    }
  };

  const changeAccount = function (option?: SelectOption) : void{
    if(option?.value){
      setTransaction({
        ...transaction,
        accountId: option?.value
      });
    }
  };

  const toggleIsPaid = function () : void{
    const commited = transaction.status === TransactionStatus.Committed;
    setTransaction(
      {
        ...transaction,
        status: commited ? TransactionStatus.NotCommitted : TransactionStatus.Committed
      }
    );
  };

  useEffect(
    ()=>{
      setTransaction(formData);
    }, 
    [formData]
  );
  
  return {
    isLoading,
    transaction,

    errors,

    changeField,
    changeType,
    changeAmount,
    changeCategory,
    changeAccount,
    toggleIsPaid,

    submitTransaction,
  };
}