import { ValidationErrors, ValidatorFn } from '@angular/forms'

// Based on https://stackoverflow.com/a/64942280
export function conditionalValidator(
  predicate: () => boolean,
  validator: ValidatorFn,
  errorNamespace?: string,
): ValidatorFn {
  return (formControl) => {
    if (!formControl.parent) {
      return null
    }
    let error = null
    if (predicate()) {
      error = validator(formControl)
      if (errorNamespace && error) {
        const customError: ValidationErrors = {}
        customError[errorNamespace] = error
        error = customError
      }
    }
    return error
  }
}
