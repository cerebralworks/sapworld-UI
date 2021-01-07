import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Logger } from '@app/logger/logger.service';
import { AccountService } from '@data/service/account.service';

const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private accountService: AccountService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.accountService.currentUserValue;
    if (currentUser && currentUser.isLoggedIn) {
      return true;
    }

    let role = route.data["roles"] as Array<number>;

    log.debug('Not authenticated, redirecting and adding redirect url...');
    const roleName = role.includes(0) ? 'user' : role.includes(1) ? 'employer' : 'agency';
    console.log(`/${roleName}/login`);

    this.router.navigate([`/auth/${roleName}/login`], { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }

}
