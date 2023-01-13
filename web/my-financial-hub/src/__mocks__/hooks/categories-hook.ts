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
      return new Promise(
        () => {
          setTimeout(() => {
            if (categories) {
              return Promise.resolve(categories);
            } else {
              return Promise.reject([]);
            }
          }, timeout);
        }
      );
    }
  );
}

export function MockUseDeleteCategory() {
  return jest.spyOn(hooks, 'UseDeleteCategory').mockImplementation(
    async () => {
      setTimeout(() => {
        Promise.resolve();
      }, randTimeOut);
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