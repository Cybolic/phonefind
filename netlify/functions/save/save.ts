import { Handler } from '@netlify/functions'
import { db } from '../firebase'
import { error, data } from '../message'
import type { User } from '../../../src/app/db.service'
import {
  isString,
  isDigits,
  isAboveLength,
  isEmail,
} from '../../../src/lib/verify'

const saveByPhoneNumber = async (number: string, data: User) => {
  const ref = db.collection('phones').doc(number)
  await ref.set(data)
  return true
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
const normaliseInputName = (input: any) => {
  if (!isString(input)) {
    return error(400, 'Missing name')
  }
  if (!isAboveLength(input, 5)) {
    return error(400, 'Name is not valid')
  }

  return input as string
}
const normaliseInputEmail = (input: any) => {
  if (!isString(input)) {
    return error(400, 'Missing email')
  }
  if (!isEmail(input)) {
    return error(400, 'Email is not valid')
  }

  return input as string
}

export const handler: Handler = async (event, _context) => {
  try {
    if (event.httpMethod !== 'POST') {
      return error(405, 'Wrong method')
    }

    let number, name, email
    try {
      const {
        number: numberString = null,
        name: nameString = null,
        email: emailString = null,
      } = JSON.parse(event.body!)
      number = normaliseInputNumber(numberString)
      name = normaliseInputName(nameString)
      email = normaliseInputEmail(emailString)
    } catch (err) {
      return error(400, 'Missing parameters')
    }

    // if error
    if (typeof number === 'object') {
      return number
    }
    if (typeof name === 'object') {
      return name
    }
    if (typeof email === 'object') {
      return email
    }

    await saveByPhoneNumber(number, { name, email })

    return data({ success: true })
  } catch (error: any) {
    return error(500, error?.message != null ? error.message : error)
  }
}
