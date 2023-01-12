import { faker } from '@faker-js/faker';
import Api from '../../commom/http/api';
import { ServiceResult } from '../../commom/interfaces/service-result';

type ApiBuilderArgs<T> = {
  GetAllResult?: ServiceResult<T[]>,
  GetAllTimeout?: number,
  DeleteResult?: boolean,
  DeleteTimeout?: number,
}

const defaultTimeout = 10;

export function CreateApi<T>(args?: ApiBuilderArgs<T>): Api<T> {
  const baseUrl = 'https://' + faker.company.bsNoun() + '.com';
  const baseEndpoint = faker.word.noun(1);

  const api = new Api<T>(baseUrl, baseEndpoint);

  if (args?.GetAllResult) {
    const getResult = args.GetAllResult;

    jest
      .spyOn(api, 'GetAllAsync')
      .mockImplementation(
        () => new Promise<ServiceResult<T[]>>(
          (resolve) => 
            setTimeout(
              () => resolve(getResult), 
              args.GetAllTimeout ?? defaultTimeout
            )
        )
      );
  }

  if (args?.DeleteResult != null) {
    const deleteResult = args.DeleteResult;

    jest
      .spyOn(api, 'DeleteAsync')
      .mockImplementation(
        () => new Promise<boolean>(
          (resolve) => 
            setTimeout(
              () => resolve(deleteResult), 
              args.DeleteTimeout ?? defaultTimeout
            )
        )
      );
  }

  return api;
}