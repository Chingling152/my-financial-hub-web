import { RenderResult, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import assert from 'assert';

interface SubmitFormProp{
  form: RenderResult, 
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
  const createButton = form.queryByText(createButtonText);

  if(createButton){
    await act(
      async ()=>{
        userEvent.click(createButton);
        jest.advanceTimersByTime(advanceTime + 1);
      }
    );
  }else{
    const updateButton = form.queryByText(updateButtonText);
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
