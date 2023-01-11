import { useState } from 'react';
import { Transaction } from '../../interfaces/transaction';
import ValidationError from '../../interfaces/validation-error';
import ValidateTransaction from '../../validators/transaction-validator';

type TransactionValidationResult = {
  type: ValidationError,
  amount: ValidationError,
  accountId: ValidationError,
  categoryId: ValidationError,
  targetDate: ValidationError,
  finishDate: ValidationError
}

interface ITransactionValidatorHookResult {
  hasError: boolean,
  errors?: TransactionValidationResult,
  validate: (transaction: Transaction) => void
}

export default function UseTransactionValidator(): ITransactionValidatorHookResult{
  const [ errors, setErrors ] = useState<TransactionValidationResult>();
  const [ hasError, setHasError ] = useState<boolean>(false);
  
  const validate = function(transaction: Transaction){
    const result = ValidateTransaction(transaction);

    setHasError(
      result.accountId.hasError  || result.amount.hasError      ||
      result.categoryId.hasError || result.finishDate.hasError  ||
      result.targetDate.hasError || result.type.hasError 
    );
    setErrors(result);
  };

  return {
    hasError,
    errors,
    validate
  };
}