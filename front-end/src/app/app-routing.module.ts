import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { SignUpPageComponent } from "./pages/sign-up-page/sign-up-page.component";
import { ArenaPageComponent } from "./pages/arena-page/arena-page.component";
import { MutantTestInfosComponent } from "./pages/mutant-test-infos/mutant-test-infos.component";

import { ConfigPageComponent } from "./pages/config-page/config-page.component";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorInterceptor, JwtInterceptor } from "./helpers";

import { AuthGuard } from "./guards/auth.guard";
import { ShellComponent } from './components/shell/shell.component';

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: ShellComponent,
    children: [
      { path: "", redirectTo: "/arena", pathMatch: "full" },
      { path: "arena", component: ArenaPageComponent },
      { path: "arena/:arena", component: ArenaPageComponent },
      { path: "report/:round", component: MutantTestInfosComponent },
    ],
    data: {
      role: 'student'
    }
  },
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: "configs",
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: ConfigPageComponent },
    ],
    data: {
      role: 'admin'
    }
  },
  {
    path: "signup",
    component: SignUpPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class AppRoutingModule { }
