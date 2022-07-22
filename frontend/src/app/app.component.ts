import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../services/AuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  test$: Observable<any>;
  constructor(private _http: HttpClient, private _authService: AuthService) {
    this.test$ = this._http.get(environment.baseUrl, { responseType: 'text' });
  }

  get isLoggedIn() {
    return this._authService.isLoggenIn;
  }
}
