import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ProfileComponent } from './profile/profile.component'
import { LoginFormComponent } from './login-form/login-form.component'

import { AuthGuard } from './auth.guard'

const routes: Routes = [
  { path: 'login', component: LoginFormComponent, outlet: 'primary' },
  {
    path: 'logout',
    component: LoginFormComponent,
    data: { logout: true },
    outlet: 'primary',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    outlet: 'primary',
  },
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
