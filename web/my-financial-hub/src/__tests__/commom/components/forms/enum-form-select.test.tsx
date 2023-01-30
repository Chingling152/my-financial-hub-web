import EnumFormSelect from '../../../../commom/components/forms/form-select/enum-form-select';
import { enumToString } from '../../../../commom/utils/enum-utils';
import { RenderFormSelectResult } from '../../../../__mocks__/forms/form-select/form-select';

enum TestEnum{
  val=9,
  sec=2,
  tes=4,
  frst=1
}

describe('on render', ()=>{
  it('should show the first item of the enum', ()=>{
    const expectedResult = enumToString(TestEnum,1);
    const { fields } = RenderFormSelectResult(
      <EnumFormSelect 
        options={TestEnum}
        disabled={false}
      />
    );
    const val = fields.toggleButton(expectedResult);
    
    expect(val).toBeInTheDocument();
    expect(val).toHaveTextContent(expectedResult);
  });
  it('should show the preset value', ()=>{
    const expectedResult = enumToString(TestEnum,2);
    const { getByText } = RenderFormSelectResult(
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
    const { actions, fields } = RenderFormSelectResult(
      <EnumFormSelect
        disabled={false}
        options={TestEnum}
      />
    );

    const randomOption = enumToString(TestEnum,4);
    actions.openAndSelectOption(placeholder,randomOption);

    const button = fields.toggleButton(randomOption);
    expect(button).toHaveTextContent(randomOption);
  });

  it('should call onChangeOption method', () => {
    const placeholder = enumToString(TestEnum,1);
    const onChangeOption = jest.fn();

    const { actions } = RenderFormSelectResult(
      <EnumFormSelect
        disabled={false}
        options={TestEnum}
        onChangeOption={onChangeOption}
      />
    );

    const randomOption = enumToString(TestEnum,9);
    actions.openAndSelectOption(placeholder,randomOption);

    expect(onChangeOption).toBeCalledTimes(1);
  });
});

describe('on clear', ()=>{
  it('should set the first item of the enum', ()=>{
    const expectedResult = enumToString(TestEnum,1);
    const { fields, actions } = RenderFormSelectResult(
      <EnumFormSelect 
        options={TestEnum}
        disabled={false}
      />
    );

    actions.clearSelection();

    const button = fields.toggleButton(expectedResult);
    expect(button).toHaveTextContent(expectedResult);
  });
});
