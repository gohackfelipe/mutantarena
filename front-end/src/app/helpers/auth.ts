export class AuthHelper {

  constructor() { }

  static isCurrentUserAdmin(currentUserSubject): boolean {
    let returnValue = false;
    if (currentUserSubject.value && currentUserSubject.value.idToken.payload['cognito:groups']) {
      returnValue = currentUserSubject.value.idToken.payload['cognito:groups'].some((T) => {
        return T === "admin";
      });
    }
    return returnValue;
  }
}
