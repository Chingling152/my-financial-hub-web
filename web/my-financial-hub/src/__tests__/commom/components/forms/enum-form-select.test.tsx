import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnumFormSelect from '../../../../commom/components/forms/form-select/enum-form-select';
import { enumToString } from '../../../../commom/utils/enum-utils';

enum TestEnum{
  val=9,
  sec=2,
  tes=4,
  frst=1
}

describe('on render', ()=>{
  it('should show the first item of the enum', ()=>{
    const expectedResult = enumToString(TestEnum,1);
    const { getByText } = render(
      <EnumFormSelect 
        options={TestEnum}
        disabled={false}
      />
    );
    const val = getByText(expectedResult);
    
    expect(val).toBeInTheDocument();
    expect(val).toHaveTextContent(expectedResult);
  });
  it('should show the preset value', ()=>{
    const expectedResult = enumToString(TestEnum,2);
    const { getByText } = render(
      <EnumFormSelect 
        options={TestEnum}
        disabled={false}
        value={TestEnum.sec}
      />
    );
    const val = getByText(expectedResult);
    
    expect(val).toBeInTheDocument();
    expect(val).toHaveTextContent(expectedResult);
  });
});
describe('on select', () => {
  it('should set the selected value', () => {
    const placeholder = enumToString(TestEnum,1);
    const { getByText } = render(
      <EnumFormSelect
        disabled={false}
        options={TestEnum}
      />
    );

    const button = getByText(placeholder);
    userEvent.click(button);

    const randomOption = enumToString(TestEnum,4);

    const option = getByText(randomOption);
    userEvent.click(option);

    expect(button).toHaveTextContent(randomOption);
  });

  it('should call onChangeOption method', () => {
    const placeholder = enumToString(TestEnum,1);
    const onChangeOption = jest.fn();

    const { getByText } = render(
      <EnumFormSelect
        disabled={false}
        options={TestEnum}
        onChangeOption={onChangeOption}
      />
    );

    const button = getByText(placeholder);
    userEvent.click(button);

    const randomOption = enumToString(TestEnum,9);
    const option = getByText(randomOption);
    userEvent.click(option);

    expect(onChangeOption).toBeCalledTimes(1);
  });
});

describe('on clear', ()=>{
  it('should set the first item of the enum', ()=>{
    const expectedResult = enumToString(TestEnum,1);
    const { getByText } = render(
      <EnumFormSelect 
        options={TestEnum}
        disabled={false}
      />
    );
    act(
      () =>{
        const val = getByText('Clear');
        userEvent.click(val);
      }
    );

    expect(getByText(expectedResult)).toHaveTextContent(expectedResult);
  });
});
