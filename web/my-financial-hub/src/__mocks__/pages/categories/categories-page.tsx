import { render } from '@testing-library/react';

import CategoriesPage from '../../../pages/categories';

import { CategoryFormComponent } from '../../forms/category-form/category-form';
import { FormSelectComponent } from '../../forms/form-select/form-select';

const defaultProps = {};

export default function RenderCategoriesPage(props = defaultProps){
  const component = render(
    <CategoriesPage {...props}/>
  );

  const { container } = component;
  return {
    ...component,
    components: {
      form: CategoryFormComponent(container),
      select: FormSelectComponent(container, 'category-select')
    }
  };
}