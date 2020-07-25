import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
  selector: "app-shell",
  templateUrl: "./shell.component.html",
  styleUrls: ["./shell.component.css"],
})
export class ShellComponent implements OnInit {
  currentUser: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() { }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

  get userName() {
    return this.authenticationService.getUserName();
  }

  get isUserAdmin() {
    return this.authenticationService.isCurrentUserAdmin();
  }
}
