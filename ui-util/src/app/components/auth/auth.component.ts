import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from "@angular/router";
import { AppState } from '../../app.service';
import {HttpClient} from "@angular/common/http";
import {Jsonp, URLSearchParams} from "@angular/http";


export enum TypeError {
  NOT_ALLOW,
  IS_EMPTY,
  NOT_EQUALS,
  NOT_SAVE
};

export enum TypeAuthStep {
  Authorize,
  ChangePassword
};

@Component({
  selector: 'auth',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["auth.component.css"],
  templateUrl: "auth.component.html"
})
export class AuthComponent implements OnInit {

  public typeError: number;
  public typeAuthStep: number = TypeAuthStep.Authorize;
  public TypeError = TypeError;
  public TypeAuthStep = TypeAuthStep;

  /* Авторизация */
  public name: string;
  public password: string;

  /* Смена пароля */
  public newPassword: string;
  public detectNewPassword: string;

  constructor(public appState: AppState, public jsonp: Jsonp, private router: Router) {}

  public ngOnInit() {

  }

  public login(login: string = '', password: string = '') {

    if (login.trim() && password.trim()) {

      let params = new URLSearchParams();
      params.set('format', 'json');
      params.set('callback', 'JSONP_CALLBACK');
      params.set('user', login);
      params.set('password', password);

      this.jsonp.get(this.appState.get("rest") + "/login", { search: params }).subscribe(data => {
        let dataInformation = data.json();

        if (dataInformation.success) {

          this.typeError = null;
          this.appState.set("username", dataInformation.data.username);
          this.appState.set("group", dataInformation.data.group);
          sessionStorage.setItem("authorize", dataInformation.data.username);

          if (dataInformation.data.first) {
            this.typeAuthStep = TypeAuthStep.ChangePassword;
          } else {
            this.router.navigate(['home']);
          }

        } else {
          this.typeError = TypeError.NOT_ALLOW;
        }

      });

    } else {
      this.typeError = TypeError.IS_EMPTY;
    }

  }

  public changePassword(newPassword: string = '', detectNewPassword: string = '') {

    if (newPassword.trim() && detectNewPassword.trim()) {
      if (newPassword !== detectNewPassword) {
        this.typeError = TypeError.NOT_EQUALS;
      } else {

        this.typeError = null;

        let params = new URLSearchParams();
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        params.set('password', newPassword);

        this.jsonp.get(this.appState.get("rest") + "/api/change-password", { search: params }).subscribe(data => {
          let dataInformation = data.json();

          if (dataInformation.success) {
            this.router.navigate(['home']);
          } else {
            this.typeError = TypeError.NOT_SAVE;
          }

        });

      }
    } else {
      this.typeError = TypeError.IS_EMPTY;
    }

  }

}
