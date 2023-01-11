/* eslint-disable semi */
export default interface ValidationError {
  hasError: boolean,
  field: string,
  message?: string
}