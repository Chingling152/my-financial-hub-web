import style from './form-select.module.scss';

import FormSelectItem from './form-select-item';
import SelectOption from './types/select-option';
import UseFormSelectOption from './hooks/form-select-option-hook';

export interface FormSelectProps{
  id?: string,
  className?:string,
  
  placeholder?: string,
  value?: string,
  disabled: boolean,
  options: SelectOption[],

  onChangeOption?: (selectedOption?: SelectOption) => void | Promise<void>,
  onDeleteOption?: (selectedOption?: string) => void | Promise<void>,
}

//TODO: change to https://react-select.com/components
export default function FormSelect(
  {
    id,className,
    disabled, placeholder = '',
    value, options,
    onChangeOption, onDeleteOption
  }:
    FormSelectProps
) {
  const { 
    selectedOption, optionsList, 
    selectOption, deleteOption ,
    isOpen, toggle
  } = UseFormSelectOption(
    {
      options, value,
      onChangeOption, onDeleteOption
    }
  );

  return (
    <div id={id} data-testid={id}>
      <div className={style.top}>
        <button
          type='button'
          className={isOpen ? 'expanded ' + className : className} aria-expanded={isOpen}
          disabled={disabled}
          onClick={toggle}
        >
          {selectedOption == -1 ? placeholder : optionsList[selectedOption].label}
        </button>
        <button
          type='button'
          onClick={() => selectOption()}
          disabled={disabled}
        >
          Clear
        </button>
      </div>
      {
        isOpen &&
          (
            <ul
              className={style[`options-body${!isOpen ?? '--hiden'}`]}
              role='listbox' aria-haspopup='listbox' 
            >
              {
                optionsList.map(
                  (option, index) => (
                    <FormSelectItem
                      key={option.value}
                      option={option}
                      isSelected={selectedOption == index}
                      onSelect={selectOption}
                      onDelete={onDeleteOption ? deleteOption : undefined}
                    />
                  )
                )
              }
            </ul>
          ) 
      }
    </div>
  );
}