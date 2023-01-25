import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SubmitForm } from '../form';
import { categoryFormFields, categoryFormSubmitText } from './category-form-fields';

const submit = async function (container: HTMLElement, timeout: number): Promise<void>{
  await SubmitForm({
    form: container, 
    advanceTime: timeout, 
    createButtonText: categoryFormSubmitText.createButtonText, 
    updateButtonText: categoryFormSubmitText.updateButtonText
  });
};

const create = async function (container: HTMLElement, timeout: number): Promise<void>{
  const createButton = categoryFormFields.create(container);
  await act(
    async ()=>{
      userEvent.click(createButton);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
};

const update = async function (container: HTMLElement, timeout: number): Promise<void>{
  const updateButton = categoryFormFields.update(container);
  await act(
    async ()=>{
      userEvent.click(updateButton);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
};

interface CategoryFormActions{
  submit: (component: HTMLElement, timeout: number) => Promise<void>,
  create: (component: HTMLElement, timeout: number) => Promise<void>,
  update: (component: HTMLElement, timeout: number) => Promise<void>
}

export const categoryFormActions: CategoryFormActions = {
  submit, create, update
};