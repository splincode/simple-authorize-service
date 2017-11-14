import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from "@angular/router";
import { AppState } from '../../app.service';
import {Jsonp, URLSearchParams} from "@angular/http";

const TypeGroup = {
  owner: "Администратор",
  member: "Пользователи"
};

@Component({
  selector: 'home',
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public name: string;
  public group: string;
  public TypeGroup = TypeGroup;
  private authorizeState;

  constructor(public appState: AppState, public jsonp: Jsonp, private router: Router) {
    this.authorizeState = JSON.parse(sessionStorage.getItem("authorizeState")) || {} as any;
    this.name = this.authorizeState.username;
    this.group = this.authorizeState.group;
  }

  public ngOnInit() {

    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    this.jsonp.get(this.appState.get("rest") + "/api", { search: params }).subscribe(data => {
      let dataInformation = data.json();

      if (!dataInformation.success) {
        this.logout();
      }
    });

    if (!this.authorizeState) {
      this.router.navigate(['/']);
    }

  }

  public changePassword() {
    this.router.navigate(['/change-password']);
  }

  public getUserList() {
    this.router.navigate(['/users']);
  }

  public preLogout() {
    this.logout(true);
  }

  public logout(closeProgram?: boolean) {

    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    this.jsonp.get(this.appState.get("rest") + "/logout", { search: params }).subscribe(data => {});
    sessionStorage.removeItem("authorizeState");

    if (!closeProgram) {
      this.router.navigate(['/']);
    } {
      parent.postMessage(JSON.stringify({type: "close"}), "*");
    }
  }

  
}
