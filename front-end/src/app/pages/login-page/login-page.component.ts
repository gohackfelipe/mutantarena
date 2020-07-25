import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// import { MatSnackBar } from "@angular/material";

import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  messageErrorLogin: string;


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authenticationService: AuthenticationService) {

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.createForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          switch (data.code) {
            case 200:
              this.loading = false;
              !this.authenticationService.isCurrentUserAdmin() ?
                this.router.navigate(['arena']) :
                this.router.navigate(['configs']);
              break;
            case 401:
              this.loading = false;
              this.messageErrorLogin = data.data.message;
              break;
            default:
              break;
          }
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
