import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
  private router: Router,
  private lg: LoginService) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      user: '',
      pass: '',
    });
  }

  ngOnInit() {
  }

  login(e: Event) {
    e.preventDefault();
    this.lg.login(this.loginForm.value.user, this.loginForm.value.pass)
      .then((r) => {
        if (r.first_login) {
          this.router.navigate(['/first_login']);
        } else {
          this.router.navigate(['/']);
        }
      }).catch((err) => {
        this.loginForm.reset();
    });
  }
}
