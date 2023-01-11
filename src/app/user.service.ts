import { Injectable } from '@angular/core'
// big import for just the validator, but the IndexedDB approach doesn't fit her
// and the limited-scope validator does
import { JSONSchema, JSONValidator } from '@ngx-pwa/local-storage'

export interface UserSession {
  name?: string
  email?: string
  uid: string
  phonenumber: string
  metadata: {
    createdAt?: string
    lastLoginAt?: string
  }
}

const schema: JSONSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', pattern: '^.+@.+[.].+$' },
    uid: { type: 'string', minLength: 5 }, // NOTE: there's no official minLength
    phonenumber: { type: 'string', minLength: 5 },
    metadata: {
      type: 'object',
      properties: {
        createdAt: { type: 'string', pattern: '^[0-9]+$' },
        lastLoginAt: { type: 'string', pattern: '^[0-9]+$' },
      },
    },
  },
  required: ['uid', 'metadata'],
}

const validateUserSessionObject = (user: any) => {
  const validator = new JSONValidator()
  return validator.validate(user, schema)
}

const parseSerialisedUser = (userSerialised: string) => {
  let user: any
  try {
    user = JSON.parse(userSerialised)
    if (validateUserSessionObject(user)) {
      return user as UserSession
    }
  } catch (err) {
    console.error('Failed to parse user session object', err)
  }
  return null
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: UserSession | null = null

  constructor() {
    this.get()
  }

  get() {
    const serialisedData = localStorage.getItem('user')
    if (serialisedData) {
      this.user = parseSerialisedUser(serialisedData)
    }
    return this.user
  }

  set(userSession: UserSession) {
    if (validateUserSessionObject(userSession)) {
      // remove extra chars so matching is easier
      userSession.phonenumber = userSession.phonenumber
        .replace(/^[+]/, '00')
        .replace(/[ -]/g, '')
      localStorage.setItem('user', JSON.stringify(userSession))
      this.user = userSession
      return userSession
    } else {
      console.warn('User data is not as expected', userSession)
    }
    return null
  }

  clear() {
    localStorage.removeItem('user')
    this.user = null
  }

  isLoggedIn(): boolean {
    return this.user != null && this.user?.uid != null
  }
}
