import { getByText, getByTitle } from '@testing-library/react';

const createButtonText = 'Create';
const updateButtonText = 'Update';

export const categoryFormSubmitText = {
  createButtonText, updateButtonText
};

interface CategoryFormFields{
  name        : (component: HTMLElement) => HTMLElement,
  description : (component: HTMLElement) => HTMLElement,
  isActive    : (component: HTMLElement) => HTMLElement,
  create      : (component: HTMLElement) => HTMLElement,
  update      : (component: HTMLElement) => HTMLElement,
}

const name        = (container: HTMLElement) => getByTitle(container, 'name');
const description = (container: HTMLElement) => getByTitle(container, 'description');
const isActive    = (container: HTMLElement) => getByTitle(container, 'isActive');
const create      = (container: HTMLElement) => getByText (container,  createButtonText);
const update      = (container: HTMLElement) => getByText (container,  updateButtonText);

export const categoryFormFields: CategoryFormFields = {
  name, description, isActive, create, update
};
