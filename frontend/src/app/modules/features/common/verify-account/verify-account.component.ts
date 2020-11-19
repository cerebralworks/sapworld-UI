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

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    const accountToken = this.route.snapshot.paramMap.get('token');
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
        this.onCountDown();
      }, error => {
        this.isLoading = false;
        this.onCountDown();
      }
    )
  }

  onCountDown = () => {
    let interval = setInterval(() => {
      this.counter--;
      if (this.counter == 0) {
        this.router.navigate(['/home']);
        clearInterval(interval);
      }
    }, 1000);

  }

}
