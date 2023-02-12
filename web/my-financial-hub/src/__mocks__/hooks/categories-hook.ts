import * as hooks from '../../commom/hooks/categories-hooks';
import { getRandomInt } from '../utils/number-utils';
import { Category } from '../../commom/interfaces/category';

const randTimeOut = getRandomInt(500, 5000);

export function MockUseCreateCategory(category: Category, timeout: number = randTimeOut) {
  return jest.spyOn(hooks, 'UseCreateCategory').mockImplementation(
    ()=>{
      jest.setTimeout(timeout);
      return Promise.resolve(category);
    }
  );
}

export function MockUseGetCategories(categories?: Category[], timeout: number = randTimeOut) {
  return jest.spyOn(hooks, 'UseGetCategories').mockImplementation(
    () => {
      jest.setTimeout(timeout);
      if (categories) {
        return Promise.resolve(categories);
      } else {
        return Promise.reject([]);
      }
    }
  );
}

export function MockUseDeleteCategory(timeout: number = randTimeOut) {
  return jest.spyOn(hooks, 'UseDeleteCategory').mockImplementation(
    async () => {
      jest.setTimeout(timeout);
      Promise.resolve();
    }
  );
}

export function MockUseUpdateCategory(category?: Category, timeout?: number) {
  return jest.spyOn(hooks, 'UseUpdateCategory').mockImplementation(
    async () => {
      setTimeout(() => {
        Promise.resolve(category);
      }, timeout ?? randTimeOut);
    }
  );
}