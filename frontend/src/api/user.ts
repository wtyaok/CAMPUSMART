import { mockApi } from './mock';

export function getOptionsApi() {
  return Promise.resolve(mockApi.options());
}
