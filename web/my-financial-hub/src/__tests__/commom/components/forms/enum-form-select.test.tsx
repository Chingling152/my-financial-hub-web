import { render } from '@testing-library/react';
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
describe('on clear', ()=>{
  it('should set the first item of the enum', ()=>{
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
});
