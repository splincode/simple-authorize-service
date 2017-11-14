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
  NOT_SAVE
};

export enum TypeAuthStep {
  Authorize,
  ChangePassword
};

const TypeGroup = {
  owner: "Администратор",
  member: "Пользователи"
};

@Component({
  selector: 'create-user',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["create-user.component.css"],
  templateUrl: "create-user.component.html"
})
export class CreateUserComponent implements OnInit {

  public typeError: number;
  public typeAuthStep: number = TypeAuthStep.Authorize;
  public TypeError = TypeError;
  public TypeAuthStep = TypeAuthStep;
  public name: string;
  public password: string;
  public TypeGroup = TypeGroup;

  public userName;
  public newPassword;
  public detectNewPassword;
  public detectSecure;
  public newGroup;

  private authorizeState;

  constructor(public appState: AppState, public jsonp: Jsonp, private router: Router) {
    this.authorizeState = JSON.parse(sessionStorage.getItem("authorizeState")) || {} as any;
  }

  public ngOnInit() {
    if (!this.authorizeState) {
      this.router.navigate(['/']);
    }
  }

  public createUser(userName = "", newPassword = "", detectNewPassword = "", detectSecure = "", newGroup = "") {
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    params.set('username', userName);
    params.set('password', newPassword);
    params.set('secure', detectSecure);
    params.set('group', newGroup);


    if (userName.trim()) {
      if (newPassword !== detectNewPassword) {
        this.typeError = TypeError.NOT_EQUALS;
      } else { 

        this.typeError = null;

        this.jsonp.get(this.appState.get("rest") + "/api/create-user", { search: params }).subscribe(data => {
          let dataInformation = data.json();

          if (dataInformation.success) {
            this.router.navigate(['user-info', userName]);
          } else {
            this.typeError = TypeError.NOT_SAVE;
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
