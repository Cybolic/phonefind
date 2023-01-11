export const error = (statusCode: number, message: string) => {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
  }
}
export const data = (data: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  }
}
