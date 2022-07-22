import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private _authService: AuthService) {}

  ngOnInit(): void {}
  get authUrl() {
    return this._authService.authUrl;
  }
}
