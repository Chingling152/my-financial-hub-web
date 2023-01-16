import { act, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { defaultCategory } from '../../commom/interfaces/category';

import CategoryForm, { CategoryFormProps } from '../../commom/components/categories/form/category-form';
import { SubmitForm } from './form';

const createButtonText = 'Create';
const updateButtonText = 'Update';

interface CategoryFormFields{
  name        : () => HTMLElement,
  description : () => HTMLElement,
  isActive    : () => HTMLElement,
  create      : () => HTMLElement,
  update      : () => HTMLElement,
}

interface CategoryFormActions{
  submit: (timeout: number) => Promise<void>,
  create: (timeout: number) => Promise<void>,
  update: (timeout: number) => Promise<void>
}

interface CategoryFormRenderResult extends RenderResult{
  fields: CategoryFormFields,
  actions: CategoryFormActions
}

export const categoryFormFields = {
  name        : (component: RenderResult): HTMLElement => component.getByTitle('name'),
  description : (component: RenderResult): HTMLElement => component.getByTitle('description'),
  isActive    : (component: RenderResult): HTMLElement => component.getByTitle('isActive'),
  create      : (component: RenderResult): HTMLElement => component.getByText(createButtonText),
  update      : (component: RenderResult): HTMLElement => component.getByText(updateButtonText)
};

export const categoryFormActions = {
  submit : async function (component: RenderResult, timeout: number): Promise<void>{
    await SubmitForm({
      form: component, 
      advanceTime: timeout, 
      createButtonText, 
      updateButtonText
    });
  },
  create:async function (component: RenderResult, timeout: number): Promise<void>{
    const createButton = categoryFormFields.create(component);
    await act(
      async ()=>{
        userEvent.click(createButton);
        jest.advanceTimersByTime(timeout + 1);
      }
    );
  },
  update:async function (component: RenderResult, timeout: number): Promise<void>{
    const updateButton = categoryFormFields.update(component);
    await act(
      async ()=>{
        userEvent.click(updateButton);
        jest.advanceTimersByTime(timeout + 1);
      }
    );
  }
};

const defaultProps = {
  formData: defaultCategory, 
  onSubmit: undefined
};

export default function RenderCategoryForm(props: CategoryFormProps = defaultProps): CategoryFormRenderResult{
  const component = render(
    <CategoryForm 
      formData={props.formData} 
      onSubmit={props.onSubmit}
    />
  );
  const renderResult = {
    ...component,
    fields: {
      name        : () => categoryFormFields.name(component),
      description : () => categoryFormFields.description(component),
      isActive    : () => categoryFormFields.isActive(component),
      create      : () => categoryFormFields.create(component),
      update      : () => categoryFormFields.update(component)
    },
    actions: {
      submit      : async (timeout: number): Promise<void> => categoryFormActions.submit(component, timeout),
      create      : async (timeout: number): Promise<void> => categoryFormActions.create(component, timeout),
      update      : async (timeout: number): Promise<void> => categoryFormActions.update(component, timeout)
    }
  };

  return renderResult;
}