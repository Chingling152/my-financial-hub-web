import RenderCategoriesPage from '../../../__mocks__/pages/categories/categories-page';

import { MockUseCreateCategory, MockUseGetCategories, MockUseUpdateCategory } from '../../../__mocks__/hooks/categories-hook';
import { CreateCategories, CreateCategory } from '../../../__mocks__/types/category-builder';
import { getRandomItem } from '../../../__mocks__/utils/array-utils';

//TODO: use https://refine.dev/blog/mocking-api-calls-in-react/

describe('on render a category', ()=> {
  beforeEach(() => jest.useFakeTimers('modern'));
  afterEach(() => jest.useRealTimers());
  it('should have a category select', ()=>{
    MockUseGetCategories([]);
    const { components : { select } } = RenderCategoriesPage();

    expect(select.container).toBeInTheDocument();
  });
  it('should have a category form', ()=>{
    MockUseGetCategories([]);
    const { components : { form } } = RenderCategoriesPage();

    expect(form.container).toBeInTheDocument();
  });
});

describe('on create a category', ()=>{
  beforeEach(() => jest.useFakeTimers('modern'));
  afterEach(() => jest.useRealTimers());
  it('should add a new category to the select component', async ()=>{
    const timeout = 10;

    const category = CreateCategory();
    const categories = CreateCategories();
    category.id = undefined;
    MockUseCreateCategory(category, timeout);
    MockUseGetCategories(categories, timeout);

    const { components: { form, select } } = RenderCategoriesPage();

    await form.actions.setFormData(category,timeout);
    await form.actions.create(timeout); 

    select.actions.toggleSelect('Select a category', timeout);
    expect(select.fields.optionByText(category.name)).toBeInTheDocument();
  });
});

describe('on update a category', ()=>{
  beforeEach(() => jest.useFakeTimers('modern'));
  afterEach(() => jest.useRealTimers());
  it('should not add a category to the select component', async ()=>{
    const timeout = 10;

    const categories = CreateCategories();
    const category = getRandomItem(categories);

    const updatedCategory = CreateCategory();
    updatedCategory.id = category.id;
    MockUseGetCategories(categories, timeout);
    MockUseUpdateCategory(updatedCategory, timeout);

    const { components: { form, select } } = RenderCategoriesPage();

    select.actions.openAndSelectOption('Select a category', category.name, timeout);
    await form.actions.update(timeout);

    select.actions.toggleSelect('Select a category');
    expect(select.fields.optionByText(category.name)).toBeInTheDocument();
  });
  it('should change the category value on the select component', async ()=>{
    const categories = CreateCategories();
    const category = categories[0];
    const timeout = 10;

    const updatedCategory = CreateCategory();
    updatedCategory.id = category.id;
    MockUseGetCategories(categories, timeout);
    MockUseUpdateCategory(updatedCategory, timeout);

    const { components: { form, select } } = RenderCategoriesPage();

    select.actions.openAndSelectOption('Select a category', category.name, timeout);
    await form.actions.update(timeout);
    
    select.actions.toggleSelect('Select a category');
    expect(select.fields.optionByText(updatedCategory.name)).toBeInTheDocument();
  });
});

describe('on select a category', ()=>{
  beforeEach(() => jest.useFakeTimers('modern'));
  afterEach(() => jest.useRealTimers());
  it('should set the category on the form', ()=>{
    const categories = CreateCategories();
    const category = getRandomItem(categories);
    const timeout = 10;
    MockUseGetCategories(categories, timeout);
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
  beforeEach(() => jest.useFakeTimers('modern'));
  afterEach(() => jest.useRealTimers());
  it('should clear the category form', ()=>{
    const categories = CreateCategories();
    const category = getRandomItem(categories);
    const timeout = 10;
    //TODO: mock GetCategory && DeleteCategory
    const { components: { form, select } } = RenderCategoriesPage();

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