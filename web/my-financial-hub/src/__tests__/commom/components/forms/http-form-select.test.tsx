import HttpFormSelect from '../../../../commom/components/forms/form-select/http-form-select';

import { CreateSelectOptions } from '../../../../__mocks__/forms/select-option-builder';
import { RenderFormSelectResult } from '../../../../__mocks__/forms/form-select/form-select';
import { AdvanceTime } from '../../../../__mocks__/utils/time-utils';

import { getRandomItem } from '../../../../__mocks__/utils/array-utils';
import { CreateApi } from '../../../../__mocks__/http/api-builder';

type MockItem = {
  id: string,
  name: string,
}

const defaultMockItemResult = {
  hasError: false,
  error: {
    message: '',
    code: -1
  },
  data: []
};

describe('on render', () => {
  beforeEach(
    () => {
      jest.useFakeTimers('modern');
    }
  );
  afterEach(
    () => {
      jest.useRealTimers();
    }
  );
  describe('when does not have a start value', () => {
    it('should show the placeholder', () => {
      const api = CreateApi<MockItem>({
        GetAllResult: defaultMockItemResult
      });

      const expectedResult = 'placeholder';
      const { fields } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={expectedResult}
          disabled={false}
        />
      );
      const val = fields.toggleButton(expectedResult);

      expect(val).toBeInTheDocument();
      expect(val).toHaveTextContent(expectedResult);
    });
  });

  describe('when has a start value', () => {
    it('should show the value', async () => {
      const options = CreateSelectOptions(5);
      const timeout = 10;
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout: timeout
      });

      const expectedResult = options[0];
      const { fields } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          value={expectedResult.value}
          disabled={false}
        />
      );

      await AdvanceTime(timeout);
      const val = fields.toggleButton(expectedResult.label);

      expect(val).toBeInTheDocument();
      expect(val).toHaveTextContent(expectedResult.label);
    });

    it('should call a get request', async()=>{
      const options = CreateSelectOptions(5);
      const timeout = 10;
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout: timeout
      });

      const expectedResult = options[0];
      RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          value={expectedResult.value}
          disabled={false}
        />
      );
      await AdvanceTime(timeout);

      expect(api.GetAllAsync).toBeCalledTimes(1);
    });
  });

  describe('when onDelete is null', () => {
    it('should not show delete option', () => {
      const api = CreateApi<MockItem>({
        GetAllResult: defaultMockItemResult
      });
      const placeholder = 'placeholder';
      const { queryByText, actions } = RenderFormSelectResult(
        <HttpFormSelect
          placeholder={placeholder}
          api={api}
          disabled={false}
        />
      );

      actions.toggleSelect(placeholder);

      const res = queryByText('Delete');
      expect(res).not.toBeInTheDocument();
    });
  });
});

describe('on click', () => {
  beforeEach(
    () => {
      jest.useFakeTimers('modern');
    }
  );
  afterEach(
    () => {
      jest.useRealTimers();
    }
  );
  describe('when enabled', () => {
    it('should open the option list', async () => {
      const timeout = 1;
      const placeholder = 'placeholder';
      const api = CreateApi<MockItem>({
        GetAllResult:  defaultMockItemResult,
        Timeout: timeout
      });

      const { fields, actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
        />
      );

      await AdvanceTime(timeout);
      
      let listbox = fields.queryOptions();
      expect(listbox).not.toBeInTheDocument();
      
      actions.toggleSelect(placeholder, timeout);
      
      listbox = fields.queryOptions();
      expect(listbox).toBeInTheDocument();
    });
    it('should call the get request', () => {
      const placeholder = 'placeholder';
      const api = CreateApi<MockItem>({
        GetAllResult: defaultMockItemResult
      });

      RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={jest.fn()}
        />
      );

      expect(api.GetAllAsync).toBeCalledTimes(1);
    });
    it('should show all the options', async () => {
      const options = CreateSelectOptions();
      const timeout = 10;
      const placeholder = 'placeholder';
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout:timeout
      });

      const { fields, actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
        />
      );
      await AdvanceTime(timeout);

      const listbox = fields.queryOptions();
      expect(listbox).not.toBeInTheDocument();

      actions.toggleSelect(placeholder);

      const childrenCount = fields.queryOptions()?.childElementCount;
      expect(childrenCount).toBe(options.length);
    });
    it('should call the onChangeOption', async () => {
      const timeout = 10;
      const options = CreateSelectOptions();
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout:timeout
      });
      
      const placeholder = 'placeholder';
      const onChangeOption = jest.fn();
      const { actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onChangeOption={onChangeOption}
        />
      );

      await AdvanceTime(timeout);

      const randomOption = getRandomItem(options);
      actions.openAndSelectOption(placeholder, randomOption.label);

      expect(onChangeOption).toBeCalledTimes(1);
      expect(onChangeOption).toBeCalledWith(randomOption);
    });
  });

  describe('when disabled', () => {
    it('should not open the option list', async () => {
      const timeout = 10;
      const placeholder = 'placeholder';
      const api = CreateApi<MockItem>({
        GetAllResult:  defaultMockItemResult,
        Timeout: timeout
      });
      
      const { fields, actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={true}
        />
      );
      await AdvanceTime(timeout);

      let listbox = fields.queryOptions();
      expect(listbox).not.toBeInTheDocument();
      actions.toggleSelect(placeholder);

      listbox = fields.queryOptions();
      expect(listbox).not.toBeInTheDocument();
    });
  });

});

describe('on select', () => {
  beforeEach(
    () => {
      jest.useFakeTimers('modern');
    }
  );
  afterEach(
    () => {
      jest.useRealTimers();
    }
  );
  it('should set the selected value on the default value', async () => {
    const timeout = 10;
    const options = CreateSelectOptions();
    const api = CreateApi<MockItem>({
      GetAllResult: {
        ...defaultMockItemResult,
        data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
      },
      Timeout:timeout
    });
    const placeholder = 'placeholder';

    const { fields, actions } = RenderFormSelectResult(
      <HttpFormSelect
        api={api}
        placeholder={placeholder}
        disabled={false}
      />
    );
    await AdvanceTime(timeout);

    const randomOption = getRandomItem(options);
    actions.openAndSelectOption(placeholder, randomOption.label, timeout);
  
    const option = fields.toggleButton(randomOption.label);
    expect(option).toHaveTextContent(randomOption.label);
  });

  it('should call onChangeOption method', async () => {
    const options = CreateSelectOptions();
    const timeout = 10;
    const api = CreateApi<MockItem>({
      GetAllResult: {
        ...defaultMockItemResult,
        data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
      },
      Timeout:timeout
    });
    
    const placeholder = 'placeholder';
    const onChangeOption = jest.fn();

    const { actions } = RenderFormSelectResult(
      <HttpFormSelect
        api={api}
        placeholder={placeholder}
        disabled={false}
        onChangeOption={onChangeOption}
      />
    );
    await AdvanceTime(timeout);

    const randomOption = getRandomItem(options);
    actions.openAndSelectOption(placeholder, randomOption.label, timeout);
    
    expect(onChangeOption).toBeCalledTimes(1);
    expect(onChangeOption).toBeCalledWith(randomOption);
  });
});

describe('on delete', () => {
  describe(
    'default behavior', () =>{
      beforeEach(
        () => {
          jest.useFakeTimers('modern');
        }
      );
      afterEach(
        () => {
          jest.useRealTimers();
        }
      );
      it('should call a delete request', async () => {
        const timeout = 10;
        const options = CreateSelectOptions();
        const api = CreateApi<MockItem>({
          GetAllResult: {
            ...defaultMockItemResult,
            data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
          },
          Timeout: timeout,
          DeleteResult: true
        });
        const placeholder = 'placeholder';
        const { actions } = RenderFormSelectResult(
          <HttpFormSelect
            api={api}
            placeholder={placeholder}
            disabled={false}
            onDeleteOption={jest.fn()}
          />
        );
        await AdvanceTime(timeout);

        const randomOption = getRandomItem(options);
        actions.openAndDeleteOption(placeholder, randomOption.value, timeout);
    
        expect(api.DeleteAsync).toBeCalledTimes(1);
        expect(api.DeleteAsync).toBeCalledWith(randomOption.value);
      });
      it('should set the placeholder value', async () => {
        const timeout = 10;
        const options = CreateSelectOptions();
        const api = CreateApi<MockItem>({
          GetAllResult: {
            ...defaultMockItemResult,
            data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
          },
          Timeout:timeout,
          DeleteResult: true
        });
        const placeholder = 'placeholder';
    
        const { fields, actions } = RenderFormSelectResult(
          <HttpFormSelect
            api={api}
            placeholder={placeholder}
            disabled={false}
            onDeleteOption={jest.fn()}
          />
        );
    
        await AdvanceTime(timeout);

        const randomOption = getRandomItem(options);
        actions.openAndDeleteOption(placeholder, randomOption.value, timeout);
    
        const button = fields.toggleButton(placeholder);
        expect(button).toHaveTextContent(placeholder);
      });
    }
  );
  describe('response successful', () => {
    beforeEach(
      () => {
        jest.useFakeTimers('modern');
      }
    );
    afterEach(
      () => {
        jest.useRealTimers();
      }
    );
    it('should remove the selected option', async () => {
      const timeout = 10;
      const options = CreateSelectOptions();
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout:timeout,
        DeleteResult: true,
        DeleteTimeout:timeout
      });
      const placeholder = 'placeholder';
  
      const { fields, actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={jest.fn()}
        />
      );
  
      await AdvanceTime(timeout);

      const randomOption = getRandomItem(options);
      actions.openAndDeleteOption(placeholder, randomOption.value, timeout);
      await AdvanceTime(timeout);

      actions.toggleSelect(placeholder);
  
      const foundOption = fields.queryOption(randomOption.label);
      expect(foundOption).not.toBeInTheDocument();
    });
    it('should call ondelete method', async() => {
      const options = CreateSelectOptions();
      const placeholder = 'placeholder';
      const timeout = 10;
      const onDeleteOption = jest.fn();
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout:timeout,
        DeleteResult: true,
        DeleteTimeout:timeout
      });
      const { actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={onDeleteOption}
        />
      );
  
      await AdvanceTime(timeout);

      const randomOption = getRandomItem(options);
      actions.openAndDeleteOption(placeholder, randomOption.value, timeout);
      await AdvanceTime(timeout);

      expect(onDeleteOption).toBeCalledTimes(1);
      expect(onDeleteOption).toBeCalledWith(randomOption);
    });
  });

  describe('response failed', () => {
    beforeEach(
      () => {
        jest.useFakeTimers('modern');
      }
    );
    afterEach(
      () => {
        jest.useRealTimers();
      }
    );
    it('should not remove the selected option', async () => {
      const timeout = 1;
      const options = CreateSelectOptions();
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout:timeout,
        DeleteResult: false,
        DeleteTimeout:timeout
      });
      const placeholder = 'placeholder';
  
      const { fields, actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={jest.fn()}
        />
      );
  
      await AdvanceTime(timeout);
      const randomOption = getRandomItem(options);
      actions.openAndDeleteOption(placeholder, randomOption.value, timeout);
      await AdvanceTime(timeout);
      actions.toggleSelect(placeholder);

      const option = fields.optionByText(randomOption.label);
      expect(option).toBeInTheDocument();
    });
    it('should not call ondelete method', async() => {
      const options = CreateSelectOptions();
      const placeholder = 'placeholder';
      const timeout = 10;
      const onDeleteOption = jest.fn();
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout:timeout,
        DeleteResult: false,
        DeleteTimeout:timeout
      });
      const { actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={onDeleteOption}
        />
      );
  
      await AdvanceTime(timeout);
      const randomOption = getRandomItem(options);
      actions.openAndDeleteOption(placeholder, randomOption.value, timeout);
      await AdvanceTime(timeout);
  
      expect(onDeleteOption).not.toBeCalled();
    });
  });
});

describe('on clear', () => {
  describe('when enabled', () => {
    beforeEach(
      () => {
        jest.useFakeTimers('modern');
      }
    );
    afterEach(
      () => {
        jest.useRealTimers();
      }
    );
    it('should set the value to placeholder', async () => {
      const options = CreateSelectOptions();
      const placeholder = 'placeholder';
      const timeout = 10;
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout:timeout
      });
      const { fields, actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
        />
      );

      await AdvanceTime(timeout);
      const randomOption = getRandomItem(options);
      actions.openAndSelectOption(placeholder, randomOption.label, timeout);
      actions.clearSelection();

      const button = fields.toggleButton(placeholder);
      expect(button).toBeInTheDocument();
    });
  });
  describe('when disabled', () => {
    beforeEach(
      () => {
        jest.useFakeTimers('modern');
      }
    );
    afterEach(
      () => {
        jest.useRealTimers();
      }
    );
    it('should not change the value', async () => {
      const options = CreateSelectOptions();
      const randomOption = getRandomItem(options);
      const timeout = 10;
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        Timeout:timeout
      });
      const { fields, actions } = RenderFormSelectResult(
        <HttpFormSelect
          api={api}
          placeholder={'placeholder'}
          disabled={true}
          value={randomOption.value}
        />
      );

      await AdvanceTime(timeout);
      actions.clearSelection();

      const button = fields.toggleButton(randomOption.label);
      expect(button).toBeInTheDocument();
    });
  });
});