import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyAccount } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {
  public isLoading: boolean;
  public counter = 5;
  public formError: any[] = [];
  public verifyAccountSuccess: boolean;
  public accountRole: string;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const accountId = this.route.snapshot.queryParamMap.get('id');
    const accountToken = this.route.snapshot.queryParamMap.get('token');
    this.accountRole = this.route.snapshot.queryParamMap.get('role');
    if (accountId && accountToken) {
      this.onVerifyAccount(accountId, accountToken)
    }
  }

  onVerifyAccount = (accountId, accountToken) => {
    let requestParams: any = {};
    requestParams.id = accountId;
    requestParams.token = accountToken;

    this.accountService.verify(requestParams).subscribe(
      response => {
        this.isLoading = false;
        this.verifyAccountSuccess = true;
        this.onCountDown();
      }, error => {
        this.verifyAccountSuccess = false;
        if(error && error.error && error.error.errors)
          this.formError = error.error.errors;
          this.onCountDown();

        this.isLoading = false;
      }
    )
  }

  onCountDown = () => {
    let interval = setInterval(() => {
      this.counter--;
      if (this.counter == 0 && this.accountRole) {
        if(this.accountRole.includes('0')) {
          this.router.navigate(['/auth/user/login']);
        }else if(this.accountRole.includes('1')) {
          this.router.navigate(['/auth/employer/login']);
        }else {
          this.router.navigate(['/home']);
        }

        clearInterval(interval);
      }
    }, 1000);

  }

}
