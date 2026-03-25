export interface FormState<TData, TErrors> {
  message: string;
  data?: TData;
  errors?: TErrors;
}
