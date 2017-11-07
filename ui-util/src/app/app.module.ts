import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { HomeComponent } from './components/home/home.component';
import { NoContentComponent } from './components/no-content/no-content.component';
import { AuthComponent } from './components/auth/auth.component';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { ROUTES } from './app.routes';
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    NoContentComponent
  ],

  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],

  providers: [
    AppState
  ]
})
export class AppModule {

}
