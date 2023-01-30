import Api from '../../commom/http/api';
import { ServiceResult } from '../../commom/interfaces/service-result';

import { faker } from '@faker-js/faker';

type ApiBuilderArgs<T> = {
  GetAllResult?: ServiceResult<T[]>,
  PostResult?: ServiceResult<T>,
  PutResult?: ServiceResult<T>,
  DeleteResult?: boolean

  Timeout?: number,
}

const defaultTimeout = 10;

function mockGetAllAsync<T>(api: Api<T>, getAllResult: ServiceResult<T[]>, getAllTimeout: number): void{
  jest
    .spyOn(api, 'GetAllAsync')
    .mockImplementation(
      () => new Promise<ServiceResult<T[]>>(
        (resolve) => 
          setTimeout(
            () => resolve(getAllResult), 
            getAllTimeout ?? defaultTimeout
          )
      )
    );
}

function mockPostAsync<T>(api: Api<T>, body: ServiceResult<T>, getAllTimeout: number): void{
  jest
    .spyOn(api, 'PostAsync')
    .mockImplementation(
      () => new Promise<ServiceResult<T>>(
        (resolve) => 
          setTimeout(
            () => resolve(body), 
            getAllTimeout ?? defaultTimeout
          )
      )
    );
}

function mockPutAsync<T>(api: Api<T>, body: ServiceResult<T>, getAllTimeout: number): void{
  jest
    .spyOn(api, 'PutAsync')
    .mockImplementation(
      () => new Promise<ServiceResult<T>>(
        (resolve) => 
          setTimeout(
            () => resolve(body), 
            getAllTimeout ?? defaultTimeout
          )
      )
    );
}


function mockDeleteAsync<T>(api: Api<T>, deleteResult: boolean, deleteTimeout: number) {
  jest
    .spyOn(api, 'DeleteAsync')
    .mockImplementation(
      () => new Promise<boolean>(
        (resolve) => 
          setTimeout(
            () => resolve(deleteResult), 
            deleteTimeout ?? defaultTimeout
          )
      )
    );
}

export function CreateApi<T>(args?: ApiBuilderArgs<T>): Api<T> {
  const baseUrl = 'https://' + faker.company.bsNoun() + '.com';
  const baseEndpoint = faker.word.noun(1);

  const api = new Api<T>(baseUrl, baseEndpoint);
  const timeout = args?.Timeout ?? 10;
  
  if (args?.GetAllResult) {
    mockGetAllAsync(api, args?.GetAllResult, timeout);
  }

  if (args?.PostResult) {
    mockPostAsync(api, args?.PostResult, timeout);
  }

  if (args?.PutResult) {
    mockPutAsync(api, args?.PutResult, timeout);
  }

  if (args?.DeleteResult) {
    mockDeleteAsync(api, args?.DeleteResult, timeout);
  }

  return api;
}