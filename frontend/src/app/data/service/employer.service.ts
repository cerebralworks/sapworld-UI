import { Injectable } from '@angular/core';
import { CacheService } from '@shared/service/cache.service';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ApiService } from '@shared/service/api.service';
import { JobPosting } from '@data/schema/post-job';


@Injectable({
  providedIn: 'root'
})
export class EmployerService extends CacheService {

  constructor(private apiService: ApiService) {
    super();
  }

  jobPost = (jobInfo: JobPosting): Observable<JobPosting> => {
    return this.apiService.post('/api/jobpostings/create', jobInfo).pipe(
      map(data => {
        return data;
      })
    );
  };

}
