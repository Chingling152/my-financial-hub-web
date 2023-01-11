import { Transaction, TransactionStatus } from '../interfaces/transaction';
import ValidationError from '../interfaces/validation-error';

type TransactionValidationResult = {
  type: ValidationError,
  amount: ValidationError,
  accountId: ValidationError,
  categoryId: ValidationError,
  targetDate: ValidationError,
  finishDate: ValidationError
}

const defaultValidationError = function(name :string){
  return ({ 
    hasError: false, 
    field: name,
    message: undefined
  });
};

export default function ValidateTransaction(transaction: Transaction): TransactionValidationResult{
  const errors: TransactionValidationResult = {
    type:       defaultValidationError('type'),
    amount:     defaultValidationError('amount'),
    accountId:  defaultValidationError('accountId'),
    categoryId: defaultValidationError('categoryId'),
    targetDate: defaultValidationError('targetDate'),
    finishDate: defaultValidationError('finishDate'),
  };

  if(!transaction.type){
    errors.type = {
      ...errors.type,
      hasError: true,
      message: 'the transaction needs a type'
    };
  }

  if(!transaction.accountId){
    errors.accountId = {
      ...errors.accountId,
      hasError: true,
      message: 'the transaction needs an account'
    };
  }

  if(transaction.amount <= 0){
    errors.amount = {
      ...errors.amount,
      hasError: true,
      message: 'the transaction amount needs to be bigger than 0'
    };
  }

  if(!transaction.categoryId){
    errors.categoryId = {
      ...errors.categoryId,
      hasError: true,
      message: 'the transaction needs a category'
    };
  }

  if(!transaction.targetDate){
    errors.targetDate = {
      ...errors.targetDate,
      hasError: true,
      message: 'the transaction needs a target date'
    };
  }

  if(!transaction.finishDate && transaction.status == TransactionStatus.Committed){
    errors.finishDate = {
      ...errors.finishDate,
      hasError: true,
      message: 'the transaction needs a finish date'
    };
  }

  return errors;
}