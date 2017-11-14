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
  selector: 'users',
  styleUrls: [ './users.component.css' ],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  public name: string;
  public group: string;
  public TypeGroup = TypeGroup;
  public userList: Array<any>;
  private authorizeState;

  constructor(public appState: AppState, public jsonp: Jsonp, private router: Router) {
    this.authorizeState = JSON.parse(sessionStorage.getItem("authorizeState")) || {} as any;
    this.name = this.authorizeState.username;
    this.group = this.authorizeState.group;

    if (TypeGroup[this.group] !== TypeGroup.owner) {
      this.router.navigate(['/']);
    }
  }

  public ngOnInit() {

    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    this.jsonp.get(this.appState.get("rest") + "/api/users", { search: params }).subscribe(data => {
      let dataInformation = data.json();

      if (!dataInformation.success) {
        this.router.navigate(['home']);
      } else {
        this.userList = this.convertToArray(dataInformation.data.users);
      }

    });

  }

  public convertToArray(obj){
    let result = [];

    for (let option in obj) {
      if (obj.hasOwnProperty(option)) {
        result.push(obj[option]);
      }
    }

    return result;

  }

  public createUser(){
    this.router.navigate(['/create-user']);
  }

  public info(username) {
    this.router.navigate(['/user-info', username]);
  }

  public cancel() {
    this.router.navigate(['/home']);
  }
  
}
