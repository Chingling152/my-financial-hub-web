import { useEffect, useState } from 'react';
import FormSelect from '..';
import { getEnumKeys, SelectEnum } from '../../../../utils/enum-utils';
import SelectOption from '../types/select-option';

type EnumFormSelectProps = {
  placeholder?: string,
  value?: number,
  disabled: boolean,
  options: SelectEnum,
  onChangeOption?: (selectedOption?: number) => void
}

export default function EnumFormSelect(
  {
    options, value,
    disabled, placeholder = '',
    onChangeOption
  }:
  EnumFormSelectProps
) {
  const [optionsList, setOptionsList] = useState<SelectOption[]>([]);
  const [enumValue, setValue] = useState<string>('-1');

  const changeOption = function (option?: SelectOption) {
    setValue(option?.value ?? optionsList[0].value);
    onChangeOption?.(parseInt(enumValue));
  };

  useEffect(() => {
    const opts = getEnumKeys(options).map<SelectOption>(key =>
      ({
        label : options[key],
        value : key.toString()
      })
    ).sort((x, y) => parseInt(x.value) - parseInt(y.value));

    setOptionsList(opts);
    setValue(value?.toString() ?? opts[0].value);
  }, [options, value]);
  
  return (
    <FormSelect 
      options={optionsList}
      value={enumValue}
      disabled={disabled}
      placeholder={placeholder}
      onChangeOption={changeOption}
    />
  );
}