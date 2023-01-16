import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import { CreateCategory } from '../../../../../__mocks__/types/category-builder';
import { MockUseCreateCategory, MockUseUpdateCategory } from '../../../../../__mocks__/hooks/categories-hook';

import RenderCategoryForm from '../../../../../__mocks__/forms/category-form';

describe('on render', () => {
  describe('default', () => {
    it.each([
      'name',
      'description',
      'isActive'
    ])('should render "%s" field', (fieldTitle: string) => {
      const { getByTitle } = RenderCategoryForm();

      const input = getByTitle(fieldTitle);
      expect(input).toBeInTheDocument();
    });
  });

  describe('without formData', () => {
    it('should render submit button with text "Create"', () => {
      const { getByText } = RenderCategoryForm();

      expect(getByText('Create')).toBeInTheDocument();
    });

    it('should render all fields empty', () => {
      const { fields } = RenderCategoryForm();

      expect(fields.name()).toHaveValue('');
      expect(fields.description()).toHaveValue('');
      expect(fields.isActive()).not.toBeChecked();
    });
  });

  describe('with formData', () => {
    it('should render submit button with text "Update"', () => {
      const category = CreateCategory();
      const { getByText } = RenderCategoryForm({formData: category});

      expect(getByText('Update')).toBeInTheDocument();
    });

    it('should fill the fields with data', () => {
      const category = CreateCategory();
      const { fields } = RenderCategoryForm({formData: category});

      expect(fields.name()).toHaveValue(category.name);
      expect(fields.description()).toHaveValue(category.description);

      const isActiveInput = fields.isActive();
      if (category.isActive) {
        expect(isActiveInput).toBeChecked();
      } else {
        expect(isActiveInput).not.toBeChecked();
      }
    });
  });
});

describe('on submit', () => {
  beforeEach(
    () => {
      jest.useFakeTimers('modern');
    }
  );
  afterEach(() => {
    jest.useRealTimers();
  });
  describe('create category', () => {
    describe('valid category', () => {
      it('should call "onSubmit" method', async () => {
        const onSubmit = jest.fn();
        const category = CreateCategory();
        category.id = undefined;
  
        const timeout = 100;
        MockUseCreateCategory(category, timeout);
  
        const { actions } = RenderCategoryForm(
          {
            formData: category, 
            onSubmit: onSubmit
          }
        );
        await actions.submit(timeout + 1);
        
        expect(onSubmit).toBeCalledTimes(1);
      });
  
      it('should reset form', async () => {
        const category = CreateCategory();
        category.id = undefined;
        const timeout = 100;
        MockUseCreateCategory(category, timeout);
  
        const { fields, actions } = RenderCategoryForm({formData: category});
        await actions.create(timeout);

        expect(fields.name()).toHaveValue('');
        expect(fields.description()).toHaveValue('');
        expect(fields.isActive()).not.toBeChecked();
      });
    });
    describe('invalid category', () => {
      it('should not call "onSubmit" method', async () => {
        const onSubmit = jest.fn();

        const { actions } = RenderCategoryForm({onSubmit: onSubmit});
        await actions.create(1);

        expect(onSubmit).not.toHaveBeenCalled();
      });
  
      it('should not start the loading', async () => {
        const category = CreateCategory();
        category.id = undefined;

        const timeout = 10;
        MockUseCreateCategory(category, timeout);
  
        const { actions, fields } = RenderCategoryForm({formData: category });
        await actions.create(timeout);

        expect(fields.create()).not.toBeDisabled();
      });
    });
  });

  describe('update category', () => {
    describe('valid category', () => {
      it('should call "onSubmit" method', async () => {
        const onSubmit = jest.fn();
        const category = CreateCategory();
  
        const timeout = 100;
        MockUseUpdateCategory(category, timeout);
  
        const { actions } = RenderCategoryForm({formData: category, onSubmit: onSubmit});
        await actions.update(timeout);
        
        expect(onSubmit).toBeCalledTimes(1);
      });
  
      it('should reset form', async () => {
        const category = CreateCategory();
        const timeout = 100;
        MockUseUpdateCategory(category, timeout);
  
        const { actions, fields } = RenderCategoryForm({formData: category});  
        await actions.update(timeout);

        expect(fields.name()).toHaveValue('');
        expect(fields.description()).toHaveValue('');
        expect(fields.isActive()).not.toBeChecked();
      });
    });
  
    describe('invalid category', () => {
      it('should not call "onSubmit" method', async () => {
        const category = CreateCategory({ name: '' });
        const onSubmit = jest.fn();
        const timeout = 10;
        MockUseUpdateCategory(category, timeout);
        
        const { actions } = RenderCategoryForm(
          {
            formData: category, 
            onSubmit: onSubmit
          }
        );
        await actions.update(timeout);

        expect(onSubmit).not.toHaveBeenCalled();
      });
   
      it('should not start the loading', async () => {
        const onSubmit = jest.fn();
        const category = CreateCategory({ name: '' });
        const timeout = 10;
        MockUseUpdateCategory(category, timeout);
  
        const { fields, actions } = RenderCategoryForm(
          {
            formData: category, 
            onSubmit: onSubmit
          }
        );
        await actions.update(timeout);

        expect(fields.update()).not.toBeDisabled();
      });
    });
  });
});

describe('on loading', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it('should disable all fields', () => {
    const category = CreateCategory();
    category.id = undefined;

    MockUseCreateCategory(category);

    const { fields } = RenderCategoryForm( {formData: category});
    act(
      () =>{
        userEvent.click(fields.create());
      }
    ); 

    expect(fields.name()).toBeDisabled();
    expect(fields.description()).toBeDisabled();
    expect(fields.isActive()).toBeDisabled();
  });
  it('should disable the submit button', () => {
    const category = CreateCategory();
    category.id = undefined;

    MockUseCreateCategory(category);

    const { fields } = RenderCategoryForm({formData: category});

    const input = fields.create();
    act(
      () => {
        userEvent.click(input);
      }
    );

    expect(input).toBeDisabled();
  });
});