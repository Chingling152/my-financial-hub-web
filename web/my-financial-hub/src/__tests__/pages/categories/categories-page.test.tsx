import { render } from '@testing-library/react';
import CategoriesPage from '../../../pages/categories';

describe('on render a category', ()=> {
  beforeEach(
    () => {
      jest.useFakeTimers('modern');
    }
  );
  afterEach(() => {
    jest.useRealTimers();
  });
  it('should have a category select', ()=>{
    render(
      <CategoriesPage />
    );
    expect(true).toBe(false);
  });
  it('should have a category form', ()=>{
    expect(true).toBe(false);
  });
});

describe('on create a category', ()=>{
  it('should add a new category to the select component', ()=>{
    expect(true).toBe(false);
  });
});

describe('on update a category', ()=>{
  it('should not add a category to the select component', ()=>{
    expect(true).toBe(false);
  });
  it('should chane the category value on the select component', ()=>{
    expect(true).toBe(false);
  });
});

describe('on select a category', ()=>{
  it('should set the category on the form', ()=>{
    expect(true).toBe(false);
  });
  it('should change the category form to update mode', ()=>{
    expect(true).toBe(false);
  });
});

describe('on delete a category', ()=>{
  it('should remove the category from the select component', ()=>{
    expect(true).toBe(false);
  });
  it('should clear the category form', ()=>{
    expect(true).toBe(false);
  });
});