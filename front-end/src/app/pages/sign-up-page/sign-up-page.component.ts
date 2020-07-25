import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from "@angular/material";
import { AuthenticationService } from '../../services/authentication.service';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authenticationService: AuthenticationService, private snackbar: MatSnackBar) {

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      // name: ['', Validators.required],
      // middleName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    // this.authenticationService.register(this.f.name.value, this.f.middleName.value, this.f.username.value, this.f.password.value)
    this.authenticationService.register(this.f.username.value, this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login']);
          this.snackbar.open("Seu cadastro foi realizado com sucesso. Verifique seu e-mail para confirmar o cadastro!", "OK");
          this.loading = false;
        },
        error => {
          this.snackbar.open("Ocorreu um erro ao tentar cadastrar o usuário", "OK");
          this.error = error;
          this.loading = false;
        });
  }
}
