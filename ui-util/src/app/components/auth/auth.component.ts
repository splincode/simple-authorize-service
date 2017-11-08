import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from "@angular/router";
import { AppState } from '../../app.service';
import {HttpClient} from "@angular/common/http";
import {Jsonp, URLSearchParams} from "@angular/http";

@Component({
  selector: 'auth',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["auth.component.css"],
  templateUrl: "auth.component.html"
})
export class AuthComponent implements OnInit {

  public isEmpty: boolean;
  public name: string;
  public password: string;

  constructor(public appState: AppState, public jsonp: Jsonp, public httpClient: HttpClient, private router: Router) {}

  public ngOnInit() {
    //parent.postMessage(JSON.stringify({type: "close"}), "*");

    let loginIsTrue = sessionStorage.getItem("authorize");
    if (loginIsTrue) {
      //this.router.navigate(['home']);
    }

  }

  public login(login: string = '', password: string = '') {

    if (login.trim() && password.trim()) {

      let params = new URLSearchParams();
      params.set('format', 'json');
      params.set('callback', 'JSONP_CALLBACK');

      this.jsonp.get(this.appState.get("rest") + "/api/people", { search: params }).subscribe(data => {
        console.log(data.json())
      });

      /*this.httpClient.get("/api/people").subscribe((result) => {
        console.log(result)
      });*/

      /*sessionStorage.setItem("authorize", login);

      this.appState.set("login", login);

      this.router.navigate(['home']);*/

    } else {

      this.isEmpty = true;

    }

  }

}
