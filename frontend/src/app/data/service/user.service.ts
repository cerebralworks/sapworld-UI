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
  /**
   * To get the user profile details
   */
  profile = (params?) => {
    return this.apiService.get('/api/users/profile', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To get the user profiles details
   */
  getUsers = (params?) => {
    return this.apiService.get('/api/users/list', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To update the user profile details
   */
  update = (params?) => {
    return this.apiService.post('/api/users/update', params).pipe(
      map(data => {
        return data;
      })
    );
  }
    /**
   * To get the user dashboard details
   */
  getUserDashboard = (params?) => {
    return this.apiService.post('/api/users/user-dashboard', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To update the user profile photo details
   */
  photoUpdate = (params?) => {
    return this.apiService.post('/api/users/update-photo', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To update the user resume details
   */
  resumeUpdate = (params?) => {
    return this.apiService.post('/api/users/update-doc-resume', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To delete the user resume details
   */
  deleteResume = (params?) => {
    return this.apiService.post('/api/users/delete-resume', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To update the user cover letter details
   */
  coverUpdate = (params?) => {
    return this.apiService.post('/api/users/update-doc-cover', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To delete the user cover letter
   */
  deleteCover = (params?) => {
    return this.apiService.post('/api/users/delete-cover', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To choose the default resume
   */
  chooseDefaultResume = (params?) => {
    return this.apiService.post('/api/users/choose-default-resume', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To get the user profile details
   */
  profileView = (params?) => {
    return this.apiService.get('/api/users/view', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To apply the for the job
   */
  jobApply = (params?) => {
    return this.apiService.post('/api/jobpostings/apply', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To get the application of the jobs
   */
  applicationsListForUser = (params?) => {
    return this.apiService.get('/api/jobpostings/applications/list-for-user', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To get the jobposting scoring
   */
  getUserScoring = (params?) => {
    return this.apiService.post('/api/jobpostings/user-scoring', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  
    /**
   * To delete the job application 
   */
   
  deleteJobApplication = (params?) => {
    return this.apiService.post('/api/user/application/delete', params).pipe(
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
