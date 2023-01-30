import { ReactElement } from 'react';

import { render, RenderResult, within } from '@testing-library/react';

import { formSelectActions } from './form-select-actions';
import { formSelectFields } from './form-select-fields';

interface FormSelectFields{
  toggleButton    : (text: string) => HTMLElement,
  clearButton     : () => HTMLElement,
  
  options         : () => HTMLElement,
  queryOptions    : () => HTMLElement | null,

  queryOption     : (text: string) => HTMLElement | null,
  optionByIndex   : (index: number) => HTMLElement,
  optionByText    : (text: string) => HTMLElement
}

interface FormSelectActions{
  clearSelection            : (timeout?: number) => void,
  openAndDeleteOption       : (placeholder :string, text :string, timeout?: number) => void,
  deleteOption              : (id :string, timeout?: number) => void,
  openAndSelectOption       : (placeholder :string, text :string, timeout?: number) => void,
  selectOption              : (text :string, timeout?: number) => void,
  toggleSelect              : (text :string, timeout?: number) => void,
}

interface FormSelectResult extends RenderResult{
  fields: FormSelectFields,
  actions: FormSelectActions
}

function createFormSelectFields(container: HTMLElement){
  return {
    toggleButton    : (text: string) => formSelectFields.toggleButton(container,text),
    clearButton     : () => formSelectFields.clear(container),
    options         : () => formSelectFields.options(container),
    queryOption     : (text: string) => formSelectFields.queryOption(container,text),
    queryOptions    : () => formSelectFields.queryOptions(container),
    optionByIndex   : (index: number) => formSelectFields.optionByIndex(container, index),
    optionByText    : (text: string) => formSelectFields.optionByText(container, text),
  };
}

function createFormSelectActions(container: HTMLElement){
  return {
    clearSelection            : (timeout = 1) => formSelectActions.clearSelection(container, timeout),
    openAndDeleteOption       : (placeholder: string, text: string, timeout = 1) => formSelectActions.openAndDeleteOption(container, placeholder, text, timeout),
    deleteOption              : (id: string, timeout = 1) => formSelectActions.deleteOption(container, id, timeout),
    openAndSelectOption       : (placeholder: string, text: string, timeout = 1) => formSelectActions.openAndSelectOption(container, placeholder, text, timeout),
    selectOption              : (text: string, timeout = 1) => formSelectActions.selectOption(container, text, timeout),
    toggleSelect              : (text: string, timeout = 1) => formSelectActions.toggleSelect(container, text, timeout)
  };
}

export const RenderFormSelectResult = function(element: ReactElement): FormSelectResult{
  const component = render(element);
  const { container } = component;

  return {
    ...component,
    fields: createFormSelectFields(container),
    actions: createFormSelectActions(container)
  }; 
};

export function FormSelectComponent(container: HTMLElement, id: string){
  const select = container.querySelector<HTMLElement>('#'+ id);

  if(select){
    const formWithin = within(select);
    return {
      ...formWithin,
      container: select,
      fields: createFormSelectFields(select),
      actions: createFormSelectActions(select)
    };
  }

  throw new Error('No FormSelect Component on this Page');
}