import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs'
import type { UserSession } from './user.service'

type Response<T> = {
  data: T
}

export interface User {
  name: string
  email: string
}

type UserData = Required<Pick<UserSession, 'name' | 'email'>> & {
  number: UserSession['phonenumber']
}

@Injectable({
  providedIn: 'root',
})
export class DBService {
  private API_URL = ''
  user: Subject<User> = new Subject()

  constructor(private http: HttpClient) {}

  private _lookupUser(phoneNumber: string) {
    return this.http.get<Response<User>>(
      `${this.API_URL}/.netlify/functions/lookup`,
      {
        params: { number: phoneNumber },
      },
    )
  }
  private _saveUser(userData: UserData) {
    return this.http.post(`${this.API_URL}/.netlify/functions/save`, userData)
  }

  readUser(phoneNumber: string) {
    this._lookupUser(phoneNumber).subscribe(({ data }) => {
      this.user.next({
        name: (data as any).name,
        email: (data as any).email,
      })
    })
  }
  saveUser(userData: UserData) {
    this._saveUser(userData).subscribe(() => {
      this.user.next({ ...userData })
    })
  }
}
