import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable } from 'rxjs';
import { AuthService, UserModel } from '@modules/auth';
import { AccountService } from '@data/service/account.service';
import { AccountLogin } from '@data/schema/account';
// import { UserModel } from '../../../../../../modules/auth/_models/user.model';
// import { AuthService } from '../../../../../../modules/auth/_services/auth.service';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<AccountLogin>;

  constructor(
    private layout: LayoutService, 
    private auth: AuthService,
    private accountService: AccountService) {}

  ngOnInit(): void {
    

    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;

    this.user$ = this.accountService.currentUserSubject.asObservable();
  }

  logout() {
    this.auth.logout();
    // document.location.reload();
  }
}
