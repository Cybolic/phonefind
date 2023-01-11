import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router'

import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): true | UrlTree {
    const url: string = state.url

    return this.checkLogin(url)
  }

  checkLogin(_url: string): true | UrlTree {
    if (this.auth.isLoggedIn) {
      return true
    }

    // Redirect to the login page
    return this.router.parseUrl('/login')
  }
}
