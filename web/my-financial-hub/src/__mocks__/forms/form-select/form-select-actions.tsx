import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formSelectFields } from './form-select-fields';

function clearSelection(container: HTMLElement, timeout: number): void {
  act(
    () => {
      const button = formSelectFields.clear(container);
      userEvent.click(button);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
}

function selectOption(container: HTMLElement, text: string, timeout: number): void {
  act(
    () => {
      const button = formSelectFields.optionByText(container, text);
      userEvent.click(button);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
}

function openAndSelectOption(container: HTMLElement, placeholder: string, text: string, timeout: number): void {
  toggleSelect(container, placeholder, timeout);
  selectOption(container, text, timeout);
}

function openAndDeleteOption(container: HTMLElement, placeholder: string, text: string, timeout: number): void {
  toggleSelect(container, placeholder, timeout);
  deleteOption(container, text, timeout);
}

function deleteOption(container: HTMLElement, value: string, timeout: number): void {
  act(
    () =>{
      const deleteButton = formSelectFields.deleteButton(container, value);
      userEvent.click(deleteButton);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
}

function toggleSelect(container: HTMLElement, text: string, timeout: number): void {
  act(
    () => {
      const button = formSelectFields.toggleButton(container,text);
      userEvent.click(button);
      jest.advanceTimersByTime(timeout + 1);
    }
  );
}

export const formSelectActions = {
  clearSelection, toggleSelect,
  selectOption, openAndSelectOption, 
  deleteOption, openAndDeleteOption
};