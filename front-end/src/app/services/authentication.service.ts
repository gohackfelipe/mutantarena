import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthHelper } from '../helpers/auth';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public isCurrentUserAdmin(): boolean {
    let returnValue = false;
    if (this.currentUserSubject.value && this.currentUserSubject.value.idToken.payload['cognito:groups']) {
      returnValue = this.currentUserSubject.value.idToken.payload['cognito:groups'].some((T) => {
        return T === "admin";
      });
    }
    return returnValue;
    // return AuthHelper.isCurrentUserAdmin(this.currentUserSubject);
  }

  public getUserEmail() {
    return this.currentUserSubject.value.idToken.payload.email;
  }

  public getUserName() {
    return this.currentUserSubject.value.idToken.payload.name;
  }

  public getRole() {
    let returnValue = "student";
    if (this.currentUserSubject.value && this.currentUserSubject.value.idToken.payload['cognito:groups']) {
      const isAdmin = this.currentUserSubject.value.idToken.payload['cognito:groups'].some((T) => {
        return T === "admin";
      });
      if (isAdmin) { returnValue = 'admin' };
    }
    return returnValue;
  }

  login(username, password) {
    return this.http.post<any>(`${environment.backend}/auth/authenticate`, { username, password })
      .pipe(map(T => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        switch (T.code) {
          case 200:
            localStorage.setItem('currentUser', JSON.stringify(T.data));
            this.currentUserSubject.next(T.data);
            return T;
          case 401:
            console.log(T);
            return T;
          default:
            break;
        }
      }));
  }

  // register(name, middleName, username, password) {
  register(username, email, password) {

    // return this.http.post<any>(`${environment.backend}/auth/register`, { name, middleName, username, password })
    return this.http.post<any>(`${environment.backend}/auth/register`, { username, email, password })
      .pipe(map(T => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        const payload = T.success.data;
        // this.currentUserSubject.next(payload);
        return payload;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
