import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { UserService } from '../user.service'
import { DBService } from '../db.service'
import type { User } from '../db.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profileForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.email]],
  })
  userData: User | null = null
  loading = true

  constructor(
    private db: DBService,
    private formBuilder: FormBuilder,
    public user: UserService, // public routerLink: RouterLink,
  ) {
    this.db.readUser(this.user.user!.phonenumber)
    this.db.user.subscribe({
      next: (user: User) => {
        this.userData = user
        this.loading = false
        this.profileForm.setValue({ name: user.name, email: user.email })
      },
      error: (_err) => (this.userData = null),
    })
  }

  save() {
    this.db.saveUser({
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      number: this.user.user!.phonenumber,
    })
    this.loading = true
    this.db.user.subscribe({
      next: () => (this.loading = false),
    })
  }
}
