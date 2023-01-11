import { Handler } from '@netlify/functions'
import { db } from '../firebase'
import { error, data } from '../message'
import { isString, isDigits, isAboveLength } from '../../../src/lib/verify'

const lookupPhoneNumber = async (number: string) => {
  const ref = db.collection('phones').doc(number)
  const doc = await ref.get()
  if (!doc.exists) {
    return null
  }
  return doc.data()
}

const normaliseInputNumber = (input: any) => {
  if (!isString(input)) {
    return error(400, 'Missing number')
  }
  if (!isDigits(input)) {
    return error(400, 'Number is not a number')
  }
  if (!isAboveLength(input, 7)) {
    return error(400, 'Number is not a phone number')
  }

  return input as string
}

export const handler: Handler = async (event, _context) => {
  try {
    if (event.httpMethod !== 'GET') {
      return error(405, 'Wrong method')
    }

    const { number: numberString = null } = event.queryStringParameters!

    const number = normaliseInputNumber(numberString)

    // if error
    if (typeof number === 'object') {
      return number
    }

    const userData = await lookupPhoneNumber(number)

    if (userData === null) {
      return error(404, 'Number not found')
    }

    return data(userData)
  } catch (error: any) {
    return error(500, error?.message != null ? error.message : error)
  }
}
