import { render, within } from '@testing-library/react';

import CategoryForm, { CategoryFormProps } from '../../../commom/components/categories/form/category-form';

import { categoryFormFields } from './category-form-fields';
import { categoryFormActions } from './category-form-actions';

import { defaultCategory } from '../../../commom/interfaces/category';

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

const defaultProps = {
  formData: defaultCategory, 
  onSubmit: undefined
};

function createCategoryFormActions(container: HTMLElement): CategoryFormActions{
  return {
    submit      : async (timeout: number): Promise<void> => categoryFormActions.submit(container, timeout),
    create      : async (timeout: number): Promise<void> => categoryFormActions.create(container, timeout),
    update      : async (timeout: number): Promise<void> => categoryFormActions.update(container, timeout)
  };
}

function createCategoryFormFields(container: HTMLElement): CategoryFormFields{
  return {
    name        : () => categoryFormFields.name(container),
    description : () => categoryFormFields.description(container),
    isActive    : () => categoryFormFields.isActive(container),
    create      : () => categoryFormFields.create(container),
    update      : () => categoryFormFields.update(container)
  };
}

export default function RenderCategoryForm(props: CategoryFormProps = defaultProps){
  const component = render(
    <CategoryForm {...props}/>
  );

  return {
    ...component,
    fields: createCategoryFormFields(component.container),
    actions: createCategoryFormActions(component.container)
  };
}

export function CategoryFormComponent(container: HTMLElement){
  const form = container.querySelector('form'); //TODO: improve search

  if(form){
    const formWithin = within(form);
    return {
      ...formWithin,
      container: form,
      fields: createCategoryFormFields(form),
      actions: createCategoryFormActions(form)
    };
  }

  throw new Error('No CategoryForm Component on this Page');
}