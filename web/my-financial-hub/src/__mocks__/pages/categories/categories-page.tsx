import { render } from '@testing-library/react';
import CategoriesPage from '../../../pages/categories';
import { CategoryFormComponent } from '../../forms/category-form/category-form';

const defaultProps = {};

export default function RenderCategoriesPage(props = defaultProps){
  const component = render(
    <CategoriesPage {...props}/>
  );

  return {
    ...component,
    components: {
      form: CategoryFormComponent(component.container)
    }
  };
}