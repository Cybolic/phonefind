import { Injectable } from '@angular/core'
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  User,
} from 'firebase/auth'
import type { ConfirmationResult } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { UserService } from './user.service'
import type { UserSession } from './user.service'

// return type from Google (the official is missing two properties)
type UserData = Partial<User> & {
  metadata: {
    createdAt?: string | null
    lastLoginAt: string | null
  }
}

// get the revelant properties from `UserData`, without `null` or `undefined`
const parseUserData = (user: UserData): UserSession => {
  return {
    ...(user.displayName != null && { name: user.displayName }),
    ...(user.email != null && { email: user.email }),
    uid: user.uid!,
    phonenumber: '',
    metadata: {
      ...(user.metadata?.createdAt != null && {
        createdAt: user.metadata.createdAt,
      }),
      ...(user.metadata?.lastLoginAt != null && {
        lastLoginAt: user.metadata.lastLoginAt,
      }),
    },
  }
}

const errorCodeToMessage = (err: any) => {
  if (err.code === 'auth/invalid-phone-number') {
    return "That's not a valid phone number."
  } else if (
    err.code === 'auth/too-many-requests' ||
    err.code === 'auth/quota-exceeded'
  ) {
    return 'Too many requests. Please try again later.'
  } else {
    // FIXME: Error codes from `confirm` would be nice as well
    return 'Unknown error'
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private verifier: RecaptchaVerifier | null = null
  private verifierId = 0
  private confirmationResult: ConfirmationResult | null = null
  private phonenumber: string | null = null

  public isLoggedIn = false
  public isAtLastStep = false

  constructor(private user: UserService) {
    this.setIsLoggedIn()
  }

  setUpRecaptcha(elementId: string) {
    this.verifier = new RecaptchaVerifier(
      elementId,
      {
        size: 'invisible',
      },
      auth,
    )
  }

  private setUser(user: UserData, phonenumber: string) {
    const userSession = parseUserData(user)
    userSession.phonenumber = phonenumber
    return this.user.set(userSession)
  }

  private setIsLoggedIn() {
    this.isLoggedIn = this.user.isLoggedIn()
  }

  async signInWithPhoneNumber(containerId: string, phoneNumber: string) {
    if (!this.verifier) {
      this.setUpRecaptcha(containerId)
    }
    await this.verifier!.render().then(
      (widgetId) => (this.verifierId = widgetId),
    )

    const promise = new Promise((resolve, reject) => {
      signInWithPhoneNumber(auth, phoneNumber, this.verifier!)
        .then((confirmationResult) => {
          this.phonenumber = phoneNumber
          this.confirmationResult = confirmationResult
          this.isAtLastStep = true
          resolve(true)
        })
        // in case of error, reset the captcha
        .catch((err) => {
          ;(window as any).grecaptcha?.reset(this.verifierId)

          return reject(errorCodeToMessage(err))
        })
    })
    return await promise
  }

  async confirmCode(code: string) {
    if (!this.confirmationResult) {
      console.error('You first need to send in your phone number')
      this.isAtLastStep = false
      return null
    }
    const promise = new Promise((resolve, reject) => {
      this.confirmationResult!.confirm(code)
        .then(({ user }) => {
          this.isAtLastStep = false
          this.setUser(user as UserData, this.phonenumber!)
          this.setIsLoggedIn()
          resolve(true)
        })
        .catch((error) => {
          return reject(errorCodeToMessage(error))
        })
    })
    return await promise
  }

  async logOut() {
    if (this.isLoggedIn) {
      this.user.clear()
      return signOut(auth)
    }
    this.setIsLoggedIn()
  }
}
