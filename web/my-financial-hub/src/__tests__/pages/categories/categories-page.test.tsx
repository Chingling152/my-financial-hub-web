import RenderCategoriesPage from '../../../__mocks__/pages/categories/categories-page';

import { MockUseCreateCategory } from '../../../__mocks__/hooks/categories-hook';
import { CreateCategories, CreateCategory } from '../../../__mocks__/types/category-builder';
import { getRandomItem } from '../../../__mocks__/utils/array-utils';

describe('on render a category', ()=> {
  beforeEach(() => jest.useFakeTimers('modern'));
  afterEach(() => jest.useRealTimers());
  it('should have a category select', ()=>{
    const { components : { select } } = RenderCategoriesPage();

    expect(select.container).toBeInTheDocument();
  });
  it('should have a category form', ()=>{
    const { components : { form } } = RenderCategoriesPage();

    expect(form.container).toBeInTheDocument();
  });
});

describe('on create a category', ()=>{
  beforeEach(() => jest.useFakeTimers('modern'));
  afterEach(() => jest.useRealTimers());
  it('should add a new category to the select component', async ()=>{
    const category = CreateCategory();
    category.id = undefined;
    const timeout = 10;
    MockUseCreateCategory(category, timeout);

    const { components: { form, select } } = RenderCategoriesPage();

    await form.actions.setFormData(category,timeout);
    await form.actions.submit(timeout);

    select.actions.toggleSelect('Select a category');

    expect(select.fields.optionByText(category.name)).toBeInTheDocument();
  });
});

describe('on update a category', ()=>{
  beforeEach(() => jest.useFakeTimers('modern'));
  afterEach(() => jest.useRealTimers());
  it('should not add a category to the select component', async ()=>{
    const categories = CreateCategories();
    const category = getRandomItem(categories);
    const timeout = 10;
    //TODO: mock get && update 
    const { components: { form, select } } = RenderCategoriesPage();

    select.actions.openAndSelectOption('Select a category', category.name, timeout);
    const updatedCategory = CreateCategory();
    updatedCategory.id = category.id;
    await form.actions.setFormData(updatedCategory, timeout);

    select.actions.toggleSelect('Select a category');
    expect(select.fields.optionByText(category.name)).toBeInTheDocument();
  });
  it('should change the category value on the select component', async ()=>{
    const categories = CreateCategories();
    const category = categories[0];
    const timeout = 10;
    //TODO: mock get && update 
    const { components: { form, select } } = RenderCategoriesPage();

    select.actions.openAndSelectOption('Select a category', category.name, timeout);
    const updatedCategory = CreateCategory();
    updatedCategory.id = category.id;
    await form.actions.setFormData(updatedCategory, timeout);
    
    select.actions.toggleSelect('Select a category');
    expect(select.fields.optionByText(updatedCategory.name)).toBeInTheDocument();
  });
});

describe('on select a category', ()=>{
  it('should set the category on the form', ()=>{
    const categories = CreateCategories();
    const category = getRandomItem(categories);
    const timeout = 10;
    //TODO: mock GetCategory
    const { components: { form, select } } = RenderCategoriesPage();

    select.actions.openAndSelectOption('Select a category', category.name, timeout);
    
    expect(form.fields.name()).toHaveValue(category.name);
    expect(form.fields.description()).toHaveValue(category.description);
    if(category.isActive){
      expect(form.fields.isActive()).toBeChecked();
    }else{
      expect(form.fields.isActive()).not.toBeChecked();
    }
  });
  it('should change the category form to update mode', ()=>{
    const categories = CreateCategories();
    const category = getRandomItem(categories);
    const timeout = 10;
    //TODO: mock GetCategory
    const { components: { form, select } } = RenderCategoriesPage();

    select.actions.openAndSelectOption('Select a category', category.name, timeout);

    expect(form.fields.update()).toBeInTheDocument();
  });
});

describe('on delete a category', ()=>{
  it('should clear the category form', ()=>{
    const categories = CreateCategories();
    const category = getRandomItem(categories);
    const timeout = 10;
    //TODO: mock GetCategory && DeleteCategory
    const { components: { form, select } } = RenderCategoriesPage();

    select.actions.openAndSelectOption('Select a category', category.name, timeout);
    select.actions.openAndDeleteOption(category.name, category.id ?? '', timeout);

    expect(form.fields.name()).toHaveValue('');
    expect(form.fields.description()).toHaveValue('');
    expect(form.fields.isActive()).not.toBeChecked();
  });
  it('should reset the category form', ()=>{
    const categories = CreateCategories();
    const category = getRandomItem(categories);
    const timeout = 10;
    //TODO: mock GetCategory && DeleteCategory
    const { components: { form, select } } = RenderCategoriesPage();

    select.actions.openAndSelectOption('Select a category', category.name, timeout);
    select.actions.openAndDeleteOption(category.name, category.id ?? '', timeout);

    expect(form.fields.create()).toBeInTheDocument();
  });
});