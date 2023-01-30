import { act } from '@testing-library/react';

export async function AdvanceTime(time: number): Promise<void>{
  await act(
    async ()=>{
      jest.advanceTimersByTime(time + 1);
    }
  );
}