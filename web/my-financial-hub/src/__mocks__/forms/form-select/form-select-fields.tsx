import { getByRole, getByTestId, getByText, queryByRole, queryByText } from '@testing-library/react';

const clearButtonText = 'Clear';
const deleteOptionText = 'delete-';

function clear(container: HTMLElement): HTMLElement{
  return getByText(container, clearButtonText);
}

function toggleButton(container: HTMLElement, text: string): HTMLElement{
  return getByText(container, text);
}

function queryOption(container: HTMLElement, text: string): HTMLElement | null{
  const opts = options(container);
  return queryByText(opts, text);
}

function queryOptions(container: HTMLElement): HTMLElement | null{
  return queryByRole(container, 'listbox');
}

function options(container: HTMLElement): HTMLElement{
  return getByRole(container, 'listbox');
}

function optionByIndex(container: HTMLElement, index: number): HTMLElement{
  return options(container).children[index] as HTMLElement;
}

function optionByText(container: HTMLElement, text: string): HTMLElement{
  return getByText(options(container), text); 
}

function deleteButton(container: HTMLElement, id: string): HTMLElement{
  return getByTestId(container, deleteOptionText + id );
}

export const formSelectFields = {
  toggleButton, clear, 
  options, 
  queryOptions, queryOption,
  deleteButton,
  optionByIndex, optionByText
};