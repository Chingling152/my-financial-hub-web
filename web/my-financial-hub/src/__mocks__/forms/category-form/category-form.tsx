import { render, within } from '@testing-library/react';

import CategoryForm, { CategoryFormProps } from '../../../commom/components/categories/form/category-form';

import { categoryFormFields } from './category-form-fields';
import { categoryFormActions } from './category-form-actions';

import { Category, defaultCategory } from '../../../commom/interfaces/category';

const defaultProps = {
  formData: defaultCategory, 
  onSubmit: undefined
};

function createCategoryFormActions(container: HTMLElement){
  return {
    submit              : async (timeout = 1):                    Promise<void> => categoryFormActions.submit(container, timeout),
    create              : async (timeout = 1):                    Promise<void> => categoryFormActions.create(container, timeout),
    update              : async (timeout = 1):                    Promise<void> => categoryFormActions.update(container, timeout),
    setName             : async (value:string,timeout = 1):       Promise<void> => categoryFormActions.setName(container, value, timeout),
    setDescription      : async (value:string,timeout = 1):       Promise<void> => categoryFormActions.setDescription(container, value, timeout),
    setIsActive         : async (value:boolean,timeout = 1):      Promise<void> => categoryFormActions.setIsActive(container, value, timeout),
    setFormData         : async (category:Category,timeout = 1):  Promise<void> => categoryFormActions.setFormData(container, category, timeout)
  };
}

function createCategoryFormFields(container: HTMLElement){
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
  const form = container.querySelector('form');

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