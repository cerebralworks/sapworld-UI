import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '../core/services/account.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleAuthGuard implements CanActivate {
    public isLoggedIn: boolean;
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.accountService.isLoggedIn().subscribe(status => {
            this.isLoggedIn = status;
        });
        const currentUser = this.accountService.currentUserValue;

        if (this.isLoggedIn) {
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // role not authorised so redirect to unauthorized page
                this.router.navigate(['/unauthorized']);
                return false;
            }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}