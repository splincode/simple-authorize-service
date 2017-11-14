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
  NOT_EXIST,
  IS_EMPTY,
  NOT_EQUALS,
  NOT_SAVE,
  BAD_HINT
};

export enum TypeAuthStep {
  Authorize,
  ChangePassword
};

@Component({
  selector: 'change-password',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["change-password.component.css"],
  templateUrl: "change-password.component.html"
})
export class ChangePasswordComponent implements OnInit {

  public typeError: number;
  public typeAuthStep: number = TypeAuthStep.Authorize;
  public TypeError = TypeError;
  public TypeAuthStep = TypeAuthStep;
  public name: string;
  public password: string;
  public newPassword: string;
  public detectNewPassword: string;
  public detectSecure: string;
  public regexp;
  private authorizeState;

  constructor(public appState: AppState, public jsonp: Jsonp, private router: Router) {
    this.authorizeState = JSON.parse(sessionStorage.getItem("authorizeState")) || {} as any;
  }

  public ngOnInit() {
    if (!this.authorizeState) {
      this.router.navigate(['/']);
    }
  }

  public changePassword(newPassword: string = '', detectNewPassword: string = '', detectSecure: string = "false") {

    if (newPassword.trim() && detectNewPassword.trim()) {
      if (newPassword !== detectNewPassword) {
        this.typeError = TypeError.NOT_EQUALS;
      } else {

        this.typeError = null;

        let params = new URLSearchParams();
        params.set('format', 'json');
        params.set('callback', 'JSONP_CALLBACK');
        params.set('password', newPassword);
        params.set('secure', detectSecure);

        this.jsonp.get(this.appState.get("rest") + "/api/change-password", { search: params }).subscribe(data => {
          let dataInformation = data.json();

          if (dataInformation.success) {
            this.router.navigate(['home']);
          } else {
            if (dataInformation.message == "NOT_SAVE") {
              this.typeError = TypeError.NOT_SAVE;
            } else if (dataInformation.message == "BAD_HINT") {
              this.typeError = TypeError.BAD_HINT;
              this.regexp = dataInformation.data.regexp;
            }
          }

        });

      }
    } else {
      this.typeError = TypeError.IS_EMPTY;
    }

  }

  public cancel() {
    this.router.navigate(['/home']);
  }

}
