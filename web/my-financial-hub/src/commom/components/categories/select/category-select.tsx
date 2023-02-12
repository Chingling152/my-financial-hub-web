import { useEffect, useState } from 'react';
import { useApisContext } from '../../../contexts/api-context';

import { UseDeleteCategory, UseGetCategories } from '../../../hooks/categories-hooks';

import SelectOption from '../../forms/form-select/types/select-option';

import FormSelect from '../../forms/form-select';

interface ICategoryFormSelectProps{
  id?: string,
  className?: string,
  value?: string,
  placeholder?: string,
  disabled: boolean,
  onChangeOption?: (selectedOption?: SelectOption) => void,
  onDeleteOption?: (selectedOption?: SelectOption) => void
}

export default function CategoryFormSelect(
  {
    id, className,
    value,
    disabled, placeholder = '',
    onChangeOption,onDeleteOption
  }:
  ICategoryFormSelectProps
) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { categoriesApi } = useApisContext();  

  const deleteCategory = async function(selectedOption?: string): Promise<void>{
    setLoading(true);
    const find = options.filter(x => x.value === selectedOption);
    const option = find.length > 0 && find[0];

    if(option){
      await UseDeleteCategory(option.value, categoriesApi);
      onDeleteOption?.(option);
    }
    setLoading(false);
  };

  useEffect(
    () => {
      const getCategories = async function(): Promise<void>{
        setLoading(true);
        const response = await UseGetCategories(categoriesApi);
        if(response){
          setOptions(
            response.map(x => 
              ({
                label: x['name'],
                value: x['id']?? ''
              })
            )
          );
        }
        setLoading(false);
      };
      getCategories();
    }, 
    [categoriesApi]
  );

  return (
    <FormSelect 
      id={id}
      className={className}
      options={options}
      value={value}
      disabled={disabled || isLoading}
      placeholder={placeholder}
      onChangeOption={onChangeOption}
      onDeleteOption={onDeleteOption && deleteCategory}
    />
  );
}