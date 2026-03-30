export interface FormState<TData, TErrors> {
  success: boolean;
  message: string;
  data?: TData;
  errors?: TErrors;
}
