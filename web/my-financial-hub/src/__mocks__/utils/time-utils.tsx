import { act } from '@testing-library/react';

export async function SkipTime(time: number): Promise<void>{
  await act(
    async ()=>{
      jest.advanceTimersByTime(time + 1);
    }
  );
}