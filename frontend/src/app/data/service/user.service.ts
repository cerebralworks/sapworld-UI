import { Injectable } from '@angular/core';
import { CacheService } from '@shared/service/cache.service';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ApiService } from '@shared/service/api.service';
import { JobPosting } from '@data/schema/post-job';
import { GetResponse, GetViewResponse } from '@data/schema/response';


@Injectable({
  providedIn: 'root'
})
export class UserService extends CacheService {

  constructor(private apiService: ApiService) {
    super();
  }

  profile = (params?) => {
    return this.apiService.get('/api/users/profile', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  update = (params?) => {
    return this.apiService.post('/api/users/update', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  photoUpdate = (params?) => {
    return this.apiService.post('/api/users/update-photo', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  profileView = (params?) => {
    return this.apiService.get('/api/users/view', params).pipe(
      map(data => {
        return data;
      })
    );
  }

}
