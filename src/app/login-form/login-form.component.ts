import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { FormBuilder, Validators } from '@angular/forms'
import { conditionalValidator } from '../../lib/validators'
import { UserService } from '../user.service'
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm = this.formBuilder.group({
    phone: [
      '',
      [
        conditionalValidator(() => !this.isAtLastStep, Validators.required),
        Validators.pattern('[+0-9 ]{6,}'),
        Validators.minLength(6),
      ],
    ],
    confirmation: [
      '',
      [
        conditionalValidator(() => !!this.isAtLastStep, Validators.required),
        Validators.pattern('[0-9]{6}'),
      ],
    ],
  })
  error: string = ''
  recaptchaId = 'recaptcha'

  loading = false
  isAtLastStep = false

  constructor(
    public user: UserService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // listen for `logout: true` route data and log the user out when it happens
    const observeLogout: Observable<boolean> = this.route.data.pipe(
      map((d) => !!d['logout']),
    )
    observeLogout.subscribe((doLogout) => {
      if (doLogout) {
        this.logout()
      }
    })
  }

  private checkStep() {
    this.isAtLastStep = !!this.auth.isAtLastStep
  }

  async login() {
    try {
      this.loading = true
      if (!this.auth.isAtLastStep) {
        await this.auth.signInWithPhoneNumber(
          this.recaptchaId,
          this.loginForm.value.phone,
        )
      } else {
        await this.auth.confirmCode(this.loginForm.value.confirmation)
        if (this.auth.isLoggedIn) {
          this.router.navigate(['profile'])
        }
      }
    } catch (errMessage: any) {
      this.error = errMessage as string
    }
    this.loading = false
    this.checkStep()
  }
  logout() {
    this.auth.logOut()
  }
}
