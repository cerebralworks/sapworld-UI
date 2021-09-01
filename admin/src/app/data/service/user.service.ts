import { Injectable } from '@angular/core';
// import { CacheService } from '@shared/service/cache.service';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

// import { ApiService } from '@shared/service/api.service';
import { JobPosting } from '@data/schema/post-job';
import { GetResponse, GetViewResponse } from '@data/schema/response';
import { CacheService } from '@shared/services/cache.service';
import { ApiService } from '@shared/services/api.service';


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

  getUsers = (params?) => {
    return this.apiService.get('/api/users/list', params).pipe(
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

  resumeUpdate = (params?) => {
    return this.apiService.post('/api/users/update-doc-resume', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  deleteResume = (params?) => {
    return this.apiService.post('/api/users/delete-resume', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  chooseDefaultResume = (params?) => {
    return this.apiService.post('/api/users/choose-default-resume', params).pipe(
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

  jobApply = (params?) => {
    return this.apiService.post('/api/jobpostings/apply', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  applicationsListForUser = (params?) => {
    return this.apiService.get('/api/jobpostings/applications/list-for-user', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  getUserScoring = (params?) => {
    return this.apiService.get('/api/jobpostings/user-scoring', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  // getJob = (params?) => {
  //   return this.apiService.get('/api/jobpostings/job-scoring', params).pipe(
  //     map(data => {
  //       return data;
  //     })
  //   );
  // }

}
