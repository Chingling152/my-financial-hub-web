import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { CreateSelectOptions } from '../../../../__mocks__/forms/select-option-builder';
import HttpFormSelect from '../../../../commom/components/forms/form-select/http-form-select';

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
      const { getByText } = render(
        <HttpFormSelect
          api={api}
          placeholder={expectedResult}
          disabled={false}
        />
      );
      const val = getByText(expectedResult);

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
        GetAllTimeout: timeout
      });

      const expectedResult = options[0];
      const { getByText } = render(
        <HttpFormSelect
          api={api}
          value={expectedResult.value}
          disabled={false}
        />
      );

      await act(
        async ()=>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      const val = getByText(expectedResult.label);

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
        GetAllTimeout: timeout
      });

      const expectedResult = options[0];
      render(
        <HttpFormSelect
          api={api}
          value={expectedResult.value}
          disabled={false}
        />
      );
      await act(
        async ()=>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );

      expect(api.GetAllAsync).toBeCalledTimes(1);
    });
  });

  describe('when onDelete is null', () => {
    it('should not show delete option', () => {
      const api = CreateApi<MockItem>({
        GetAllResult: defaultMockItemResult
      });
      const { queryByText } = render(
        <HttpFormSelect
          api={api}
          disabled={false}
        />
      );

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
        GetAllTimeout: timeout
      });

      const { queryByRole, getByText } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
        />
      );

      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      
      let listbox = queryByRole('listbox');
      expect(listbox).not.toBeInTheDocument();
      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );
      
      listbox = queryByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });
    it('should call the get request', () => {
      const placeholder = 'placeholder';
      const api = CreateApi<MockItem>({
        GetAllResult: defaultMockItemResult
      });

      render(
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
        GetAllTimeout:timeout
      });

      const { queryByRole, getByText } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
        />
      );
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );

      const listbox = queryByRole('listbox');
      expect(listbox).not.toBeInTheDocument();
      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );

      const childrenCount = queryByRole('listbox')?.childElementCount;
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
        GetAllTimeout:timeout
      });
      
      const placeholder = 'placeholder';
      const onChangeOption = jest.fn();
      const { getByText } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onChangeOption={onChangeOption}
        />
      );

      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );

      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );
      const randomOption = getRandomItem(options);

      await act(
        async () =>{
          const option = getByText(randomOption.label);
          userEvent.click(option);
        }
      );

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
        GetAllTimeout: timeout
      });
      
      const { queryByRole, getByText } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={true}
        />
      );
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );

      let listbox = queryByRole('listbox');
      expect(listbox).not.toBeInTheDocument();
      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );

      listbox = queryByRole('listbox');
      expect(listbox).not.toBeInTheDocument();
    });
  });

});

describe('on select', () => {
  it('should set the selected value on the default value', async () => {
    const timeout = 10;
    const options = CreateSelectOptions();
    const api = CreateApi<MockItem>({
      GetAllResult: {
        ...defaultMockItemResult,
        data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
      },
      GetAllTimeout:timeout
    });
    const placeholder = 'placeholder';

    const { getByText } = render(
      <HttpFormSelect
        api={api}
        placeholder={placeholder}
        disabled={false}
      />
    );
    await act(
      async () =>{
        jest.advanceTimersByTime(timeout + 1);
      }
    );

    await act(
      async () =>{
        const button = getByText(placeholder);
        userEvent.click(button);
      }
    );

    const randomOption = getRandomItem(options);

    await act(
      async () =>{
        const option = getByText(randomOption.label);
        userEvent.click(option);
      }
    );
  
    expect(getByText(randomOption.label)).toHaveTextContent(randomOption.label);
  });

  it('should call onChangeOption method', async () => {
    const options = CreateSelectOptions();
    const timeout = 10;
    const api = CreateApi<MockItem>({
      GetAllResult: {
        ...defaultMockItemResult,
        data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
      },
      GetAllTimeout:timeout
    });
    
    const placeholder = 'placeholder';
    const onChangeOption = jest.fn();

    const { getByText } = render(
      <HttpFormSelect
        api={api}
        placeholder={placeholder}
        disabled={false}
        onChangeOption={onChangeOption}
      />
    );
    await act(
      async () =>{
        jest.advanceTimersByTime(timeout + 1);
      }
    );

    await act(
      async () =>{
        const button = getByText(placeholder);
        userEvent.click(button);
      }
    );

    const randomOption = getRandomItem(options);
    await act(
      async () =>{
        const option = getByText(randomOption.label);
        userEvent.click(option);
      }
    );
    
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
          GetAllTimeout: timeout,
          DeleteResult: true,
          DeleteTimeout:timeout
        });
        const placeholder = 'placeholder';
        const { getByText, getByTestId } = render(
          <HttpFormSelect
            api={api}
            placeholder={placeholder}
            disabled={false}
            onDeleteOption={jest.fn()}
          />
        );
        await act(
          async () =>{
            jest.advanceTimersByTime(timeout + 1);
          }
        );
        await act(
          async () =>{
            const button = getByText(placeholder);
            userEvent.click(button);
          }
        );
    
        const randomOption = getRandomItem(options);
        await act(
          async () =>{
            const option = getByTestId('delete-' + randomOption.value);
            userEvent.click(option);
          }
        );
        await act(
          async () =>{
            jest.advanceTimersByTime(timeout + 1);
          }
        );
    
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
          GetAllTimeout:timeout,
          DeleteResult: true,
          DeleteTimeout:timeout
        });
        const placeholder = 'placeholder';
    
        const { getByText, getByTestId } = render(
          <HttpFormSelect
            api={api}
            placeholder={placeholder}
            disabled={false}
            onDeleteOption={jest.fn()}
          />
        );
    
        await act(
          async () =>{
            jest.advanceTimersByTime(timeout + 1);
          }
        );
        await act(
          async () =>{
            const button = getByText(placeholder);
            userEvent.click(button);
          }
        );
    
        await act(
          async () =>{
            const randomOption = getRandomItem(options);
            const option = getByTestId('delete-' + randomOption.value);
            userEvent.click(option);
          }
        );
        await act(
          async () =>{
            jest.advanceTimersByTime(timeout + 1);
          }
        );
    
        const button = getByText(placeholder);
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
        GetAllTimeout:timeout,
        DeleteResult: true,
        DeleteTimeout:timeout
      });
      const placeholder = 'placeholder';
  
      const { getByText, getByTestId, queryByText } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={jest.fn()}
        />
      );
  
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );
  
      const randomOption = getRandomItem(options);
      await act(
        async () =>{
          const option = getByTestId('delete-' + randomOption.value);
          userEvent.click(option);
        }
      );
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
  
      await act(
        async () =>{
          userEvent.click(getByText(placeholder));
        }
      );
  
      expect(queryByText(randomOption.label)).not.toBeInTheDocument();
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
        GetAllTimeout:timeout,
        DeleteResult: true,
        DeleteTimeout:timeout
      });
      const { getByText, getByTestId } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={onDeleteOption}
        />
      );
  
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );
  
      const randomOption = getRandomItem(options);
      await act(
        async () =>{
          const option = getByTestId('delete-' + randomOption.value);
          userEvent.click(option);
        }
      );
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
  
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
        GetAllTimeout:timeout,
        DeleteResult: false,
        DeleteTimeout:timeout
      });
      const placeholder = 'placeholder';
  
      const { getByText, getByTestId } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={jest.fn()}
        />
      );
  
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );
  
      const randomOption = getRandomItem(options);
      await act(
        async () =>{
          const option = getByTestId('delete-' + randomOption.value);
          userEvent.click(option);
        }
      );
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      
      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );
      
      expect(getByText(randomOption.label)).toBeInTheDocument();
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
        GetAllTimeout:timeout,
        DeleteResult: false,
        DeleteTimeout:timeout
      });
      const { getByText, getByTestId } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
          onDeleteOption={onDeleteOption}
        />
      );
  
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      await act(
        async () =>{
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );
  
      const randomOption = getRandomItem(options);
      await act(
        async () =>{
          const option = getByTestId('delete-' + randomOption.value);
          userEvent.click(option);
        }
      );
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
  
      expect(onDeleteOption).not.toBeCalled();
    });
  });
});

describe('on clear', () => {
  describe('when enabled', () => {
    it('should set the value to placeholder', async () => {
      const options = CreateSelectOptions();
      const placeholder = 'placeholder';
      const timeout = 10;
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        GetAllTimeout:timeout
      });
      const { getByText } = render(
        <HttpFormSelect
          api={api}
          placeholder={placeholder}
          disabled={false}
        />
      );
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      act(
        () => {
          const button = getByText(placeholder);
          userEvent.click(button);
        }
      );

      act(
        () => {
          const randomOption = getRandomItem(options);
          const option = getByText(randomOption.label);
          userEvent.click(option);
        }
      );

      act(
        () => {
          const button = getByText('Clear');
          userEvent.click(button);
        }
      );
      const button = getByText(placeholder);
      expect(button).toBeInTheDocument();
    });
  });
  describe('when disabled', () => {
    it('should not change the value', async () => {
      const options = CreateSelectOptions();
      const randomOption = getRandomItem(options);
      const timeout = 10;
      const api = CreateApi<MockItem>({
        GetAllResult: {
          ...defaultMockItemResult,
          data: options.map(x => ({ id: x.value, name: x.label } as MockItem))
        },
        GetAllTimeout:timeout
      });
      const { getByText } = render(
        <HttpFormSelect
          api={api}
          placeholder={'placeholder'}
          disabled={true}
          value={randomOption.value}
        />
      );
      await act(
        async () =>{
          jest.advanceTimersByTime(timeout + 1);
        }
      );
      act(
        () => {
          const button = getByText('Clear');
          userEvent.click(button);
        }
      );
      const button = getByText(randomOption.label);
      expect(button).toBeInTheDocument();
    });
  });
});