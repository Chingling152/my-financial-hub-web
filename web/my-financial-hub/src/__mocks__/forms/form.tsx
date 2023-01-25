import { act, queryByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import assert from 'assert';

interface SubmitFormProp{
  form: HTMLElement, 
  createButtonText?: string, 
  updateButtonText?: string,
  advanceTime?: number
}

export async function SubmitForm(
  {
    form, 
    createButtonText = 'Create', 
    updateButtonText = 'Update', 
    advanceTime = 10 
  } : SubmitFormProp
): Promise<void>{
  const createButton = queryByText(form, createButtonText);

  if(createButton){
    await act(
      async ()=>{
        userEvent.click(createButton);
        jest.advanceTimersByTime(advanceTime + 1);
      }
    );
  }else{
    const updateButton = queryByText(form, updateButtonText);
    if(updateButton){
      await act(
        async ()=>{
          userEvent.click(updateButton);
          jest.advanceTimersByTime(advanceTime + 1);
        }
      );
    }else{
      assert.fail('No create or update button found');
    }
  }
}
