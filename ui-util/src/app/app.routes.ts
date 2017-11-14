import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UsersComponent } from './components/users/users.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { NoContentComponent } from './components/no-content/no-content.component';
import { AuthComponent } from "./components/auth/auth.component";

export const ROUTES: Routes = [
  { path: '',      component: AuthComponent, pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'create-user',  component: CreateUserComponent },
  { path: 'change-password',  component: ChangePasswordComponent },
  { path: 'user-info/:username',  component: UserInfoComponent },
  { path: 'users',  component: UsersComponent },
  { path: '**',    component: NoContentComponent },
];
