import * as Yup from 'yup';

type Errors = Record<string, string>;

export default function getValidationErrors(err: Yup.ValidationError) {
  const validationErrors: Errors = {};
  err.inner.forEach((error) => {
    if (error.path) validationErrors[error.path] = error.message;
  });
  return validationErrors;
}
