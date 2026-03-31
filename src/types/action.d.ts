export interface FormState<TData, TErrors> {
  success: boolean | null;
  message: string;
  data?: TData;
  errors?: TErrors;
}
