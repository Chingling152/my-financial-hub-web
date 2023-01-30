import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Category } from '../../../commom/interfaces/category';

import { SubmitForm } from '../form';
import { categoryFormFields, categoryFormSubmitText } from './category-form-fields';

const submit = async function (container: HTMLElement, timeout: number): Promise<void> {
  await SubmitForm({
    form: container,
    advanceTime: timeout,
    createButtonText: categoryFormSubmitText.createButtonText,
    updateButtonText: categoryFormSubmitText.updateButtonText
  });
};

const create = async function (container: HTMLElement, timeout: number): Promise<void> {
  const createButton = categoryFormFields.create(container);
  await act(
    async () => {
      userEvent.click(createButton);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
};

const update = async function (container: HTMLElement, timeout: number): Promise<void> {
  const updateButton = categoryFormFields.update(container);
  await act(
    async () => {
      userEvent.click(updateButton);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
};

const setName = async function (container: HTMLElement, value: string, timeout: number): Promise<void> {
  const nameField = categoryFormFields.name(container);
  await act(
    async () => {
      userEvent.type(nameField, value);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
};

const setDescription = async function (container: HTMLElement, value: string, timeout: number): Promise<void> {
  const descriptionField = categoryFormFields.description(container);
  await act(
    async () => {
      userEvent.type(descriptionField, value);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
};

const setIsActive = async function (container: HTMLElement, value: boolean, timeout: number): Promise<void> {
  const setIsActiveField = categoryFormFields.isActive(container) as HTMLInputElement;
  if (value != setIsActiveField.checked) {
    await act(
      async () => {
        userEvent.click(setIsActiveField);
        jest.advanceTimersByTime(timeout + 1);
      }
    );
  }
};

const setFormData = async function(container: HTMLElement, category: Category , timeout: number): Promise<void> {
  await setName(container, category.name, timeout);
  await setDescription(container, category.description, timeout);
  await setIsActive(container, category.isActive, timeout);
};

export const categoryFormActions = {
  submit, create, update,
  setName, setDescription, setIsActive,
  setFormData
};