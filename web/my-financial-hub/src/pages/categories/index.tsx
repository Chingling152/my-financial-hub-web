import { useState } from 'react';

import { Category, defaultCategory } from '../../commom/interfaces/category';

import CategoryForm from '../../commom/components/categories/form/category-form';
import SelectOption from '../../commom/components/forms/form-select/types/select-option';
import CategoryFormSelect from '../../commom/components/categories/select/category-select';

export default function CategoriesPage() {  
  const [categories,setCategories] = useState<Category[]>([]);
  const [selectedCategory, setCategory] = useState<Category>();
  const [isLoading, setLoading] = useState(false);

  const selectCategory = function(option?: SelectOption){
    if(!option){
      setCategory(defaultCategory);
    }else{
      const foundCategories = categories.filter(c => c.id == option.value);
      if(foundCategories.length > 0){
        setCategory(foundCategories[0]);
      }
    }
  };

  const deleteCategory = function(item?: SelectOption): void{
    setCategories(categories.filter(c => c.id != item?.value));
    setCategory(defaultCategory);
  };

  const submitCategory = async function(category: Category): Promise<void>{
    setLoading(true);
    const foundCategories = categories.filter(c => c.id == category.id);

    if(foundCategories.length > 0){
      const index = categories.findIndex(obj => obj.id == category.id);
      categories[index] = category;
      setCategories([...categories]);
    }else{
      setCategories([...categories, category]);
    }
    setLoading(false);
  };
  
  return (
    <div className='container'>
      <CategoryForm 
        formData={selectedCategory} 
        onSubmit={submitCategory}
      />
      <CategoryFormSelect 
        id='category-select'
        placeholder='Select a category'
        disabled={isLoading}
        onChangeOption={selectCategory}
        onDeleteOption={deleteCategory}
      />
    </div>
  );
}