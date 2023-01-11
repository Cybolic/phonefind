import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { SpinnerDottedModule } from 'spinners-angular/spinner-dotted'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { DBService } from './db.service'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { LoginFormComponent } from './login-form/login-form.component'
import { ProfileComponent } from './profile/profile.component'

@NgModule({
  declarations: [AppComponent, LoginFormComponent, ProfileComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SpinnerDottedModule,
  ],
  providers: [UserService, AuthService, DBService],
  bootstrap: [AppComponent],
})
export class AppModule {}
