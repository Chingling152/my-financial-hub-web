import { CreateSelectOptions } from '../../../../__mocks__/forms/select-option-builder';
import { getRandomItem } from '../../../../__mocks__/utils/array-utils';

import FormSelect from '../../../../commom/components/forms/form-select';
import { RenderFormSelectResult } from '../../../../__mocks__/forms/form-select/form-select';

describe('on render', () => {
  describe('when does not have a start value', () => {
    it('should show the placeholder', () => {
      const expectedResult = 'placeholder';
      const { fields } = RenderFormSelectResult(
        <FormSelect
          placeholder={expectedResult}
          disabled={false}
          options={[]}
        />
      );
      const val = fields.toggleButton(expectedResult);

      expect(val).toBeInTheDocument();
      expect(val).toHaveTextContent(expectedResult);
    });
  });

  describe('when has a start value', () => {
    it('should show the value', () => {
      const options = CreateSelectOptions(5);
      const expectedResult = options[0];
      const { fields } = RenderFormSelectResult(
        <FormSelect
          value={expectedResult.value}
          disabled={false}
          options={options}
        />
      );
      const val = fields.toggleButton(expectedResult.label);

      expect(val).toBeInTheDocument();
      expect(val).toHaveTextContent(expectedResult.label);
    });
  });

  describe('when onDelete is null', () => {
    it('should not show delete option', () => {
      const expectedResult = 'placeholder';
      const { actions, queryByText } = RenderFormSelectResult(
        <FormSelect
          placeholder={expectedResult}
          disabled={false}
          options={[]}
        />
      );

      actions.toggleSelect(expectedResult);

      const res = queryByText('Delete');
      expect(res).not.toBeInTheDocument();
    });
  });

});

describe('on click', () => {
  describe('when enabled', () => {
    it('should open the option list', () => {
      const options = CreateSelectOptions();
      const placeholder = 'placeholder';

      const { actions, fields } = RenderFormSelectResult(
        <FormSelect
          placeholder={placeholder}
          disabled={false}
          options={options}
        />
      );

      let listbox = fields.queryOptions();
      expect(listbox).not.toBeInTheDocument();

      actions.toggleSelect(placeholder);

      listbox = fields.queryOptions();
      expect(listbox).toBeInTheDocument();
    });
    it('should show all the options', () => {
      const options = CreateSelectOptions();
      const placeholder = 'placeholder';

      const { actions, fields } = RenderFormSelectResult(
        <FormSelect
          placeholder={placeholder}
          disabled={false}
          options={options}
        />
      );

      const listbox = fields.queryOptions();
      expect(listbox).not.toBeInTheDocument();

      actions.toggleSelect(placeholder);

      const childrenCount = fields.queryOptions()?.childElementCount;
      expect(childrenCount).toBe(options.length);
    });
  });
  describe('when disabled', () => {
    it('should not open the option list', () => {
      const options = CreateSelectOptions();
      const placeholder = 'placeholder';

      const { fields, actions } = RenderFormSelectResult(
        <FormSelect
          placeholder={placeholder}
          disabled={true}
          options={options}
        />
      );

      let listbox = fields.queryOptions();
      expect(listbox).not.toBeInTheDocument();

      actions.toggleSelect(placeholder);

      listbox = fields.queryOptions();
      expect(listbox).not.toBeInTheDocument();
    });
  });
});

describe('on select', () => {
  it('should set the selected value', () => {
    const options = CreateSelectOptions();
    const placeholder = 'placeholder';

    const { fields, actions } = RenderFormSelectResult(
      <FormSelect
        placeholder={placeholder}
        disabled={false}
        options={options}
      />
    );

    const randomOption = getRandomItem(options);
    actions.openAndSelectOption(placeholder, randomOption.label);

    const button = fields.toggleButton(randomOption.label);
    expect(button).toHaveTextContent(randomOption.label);
  });
  it('should call onChangeOption method', () => {
    const options = CreateSelectOptions();
    const placeholder = 'placeholder';
    const onChangeOption = jest.fn();

    const { actions } = RenderFormSelectResult(
      <FormSelect
        placeholder={placeholder}
        disabled={false}
        options={options}
        onChangeOption={onChangeOption}
      />
    );

    const randomOption = getRandomItem(options);
    actions.openAndSelectOption(placeholder, randomOption.label);

    expect(onChangeOption).toBeCalledTimes(1);
  });
});

describe('on delete', () => {
  it('should remove the selected option', () => {
    const options = CreateSelectOptions();
    const placeholder = 'placeholder';
    const randomOption = getRandomItem(options);

    const { actions, fields } = RenderFormSelectResult(
      <FormSelect
        placeholder={placeholder}
        disabled={false}
        options={options}
        value={randomOption.value}
        onDeleteOption={jest.fn()}
      />
    );

    actions.toggleSelect(randomOption.label);
    actions.deleteOption(randomOption.value);

    expect(fields.toggleButton(placeholder)).toHaveTextContent(placeholder);
  });
  it('should remove the option from the option list', () => {
    const options = CreateSelectOptions();
    const placeholder = 'placeholder';

    const { fields, actions } = RenderFormSelectResult(
      <FormSelect
        placeholder={placeholder}
        disabled={false}
        options={options}
        onDeleteOption={jest.fn()}
      />
    );

    actions.toggleSelect(placeholder);

    const randomOption = getRandomItem(options);
    expect(fields.optionByText(randomOption.label)).toBeInTheDocument();

    actions.deleteOption(randomOption.value);
    actions.toggleSelect(placeholder);

    expect(fields.queryOption(randomOption.label)).not.toBeInTheDocument();
  });
  it('should call ondelete method', () => {
    const options = CreateSelectOptions();
    const placeholder = 'placeholder';
    const onDeleteOption = jest.fn();

    const { actions } = RenderFormSelectResult(
      <FormSelect
        placeholder={placeholder}
        disabled={false}
        options={options}
        onDeleteOption={onDeleteOption}
      />
    );

    actions.toggleSelect(placeholder);
    const randomOption = getRandomItem(options);
    actions.deleteOption(randomOption.value);

    expect(onDeleteOption).toBeCalledTimes(1);
  });
});

describe('on clear', () => {
  describe('when enabled', () => {
    it('should set the value to placeholder', () => {
      const options = CreateSelectOptions();
      const placeholder = 'placeholder';

      const { actions, fields } = RenderFormSelectResult(
        <FormSelect
          placeholder={placeholder}
          disabled={false}
          options={options}
        />
      );

      const randomOption = getRandomItem(options);
      actions.openAndSelectOption(placeholder, randomOption.label);
      actions.clearSelection();

      const button = fields.toggleButton(placeholder);
      expect(button).toBeInTheDocument();
    });
  });
  describe('when disabled', () => {
    it('should not change the value', () => {
      const options = CreateSelectOptions();
      const randomOption = getRandomItem(options);

      const { actions, fields } = RenderFormSelectResult(
        <FormSelect
          value={randomOption.value}
          disabled={true}
          options={options}
        />
      );

      actions.clearSelection();

      const button = fields.toggleButton(randomOption.label);
      expect(button).toBeInTheDocument();
    });
  });
});