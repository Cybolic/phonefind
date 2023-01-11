export const isString = (input: string) =>
  input && typeof input === 'string' && input.length > 0

export const isDigits = (input: string) =>
  input.split('').every((char) => '0123456789'.includes(char))

export const isAboveLength = (input: string, length: number) =>
  input.trim().length > length

export const isEmail = (input: string) =>
  input.length > 5 && input.includes('@') && input.includes('.')
