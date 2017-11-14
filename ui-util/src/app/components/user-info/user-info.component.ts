import {
  Component,
  OnInit
} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AppState } from '../../app.service';
import {Jsonp, URLSearchParams} from "@angular/http";

const TypeGroup = {
  owner: "Администратор",
  member: "Пользователи"
};

@Component({
  selector: 'user-info',
  styleUrls: [ './user-info.component.css' ],
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {

  public name: string;
  public username: string;
  public group: string;
  public TypeGroup = TypeGroup;
  public userInfo;
  private authorizeState;

  constructor(public appState: AppState, public jsonp: Jsonp, private router: Router, private route: ActivatedRoute) {
    this.authorizeState = JSON.parse(sessionStorage.getItem("authorizeState")) || {} as any;
    this.name = this.authorizeState.username;
    this.group = this.authorizeState.group;


    if (this.inIframe()) {

      let self = this;
      window.addEventListener("message", function (event) {
      
        let messageEvent = JSON.parse(event.data);
        console.info(messageEvent);

        switch (messageEvent.type) {

            case "set-password":
              let params = new URLSearchParams();
              params.set('format', 'json');
              params.set('callback', 'JSONP_CALLBACK');
              params.set('username', messageEvent.username);
              params.set('regexp', encodeURIComponent(messageEvent.regexp || ""));

              self.jsonp.get(self.appState.get("rest") + "/api/password-constraint", { search: params }).subscribe(data => {
                let dataInformation = data.json();
                console.log(dataInformation)
                self.router.navigate(['/home']);
              });
            break;
        }

      }, false);


    }

  }

  public ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    params.set('username', this.username);

    this.jsonp.get(this.appState.get("rest") + "/api/user-info", { search: params }).subscribe(data => {
      let dataInformation = data.json();
      this.userInfo = dataInformation.data.info;
    });
  }

  public removeUser(userName) {
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    params.set('username', userName);

    this.jsonp.get(this.appState.get("rest") + "/api/remove-user", { search: params }).subscribe(data => {
      let dataInformation = data.json();
      this.router.navigate(['users']);
    });

  }

  public blockUser(userName) {
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    params.set('username', userName);

    this.jsonp.get(this.appState.get("rest") + "/api/block-user", { search: params }).subscribe(data => {
      let dataInformation = data.json();
      this.router.navigate(['users']);
    });
  }

  public unBlockUser(userName) {
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    params.set('username', userName);

    this.jsonp.get(this.appState.get("rest") + "/api/unblock-user", { search: params }).subscribe(data => {
      let dataInformation = data.json();
      this.router.navigate(['users']);
    });
  }

  public setPasswordConstraint(userName) {
  
    if (this.inIframe()) {
      parent.postMessage(JSON.stringify({
        type: "get-password", 
        username: userName
      }), "*");
    } else {
      let constraint = parent.prompt(
        "Парольное ограничение (по умолчанию, наличие латинских букв и символов кириллицы)", 
        '^([а-яё]+[a-z]+)$'
      );

      let params = new URLSearchParams();
      params.set('format', 'json');
      params.set('callback', 'JSONP_CALLBACK');
      params.set('username', userName);
      params.set('regexp', encodeURIComponent(constraint || ""));

      console.log(params);

      this.jsonp.get(this.appState.get("rest") + "/api/password-constraint", { search: params }).subscribe(data => {
        let dataInformation = data.json();
        this.router.navigate(['/home']);
      });
    }
    
  }

  public cancel() {
    this.router.navigate(['/home']);
  }

  public inIframe () {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
  }
  
}
