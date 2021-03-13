import { Injectable } from '@angular/core';
// import { CacheService } from '@shared/service/cache.service';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

// import { ApiService } from '@shared/service/api.service';
import { JobPosting } from '@data/schema/post-job';
import { GetResponse, GetViewResponse } from '@data/schema/response';
import { ApiService } from '@shared/services/api.service';
import { CacheService } from '@shared/services/cache.service';


@Injectable({
  providedIn: 'root'
})
export class EmployerService extends CacheService {

  constructor(private apiService: ApiService) {
    super();
  }

  jobUpdate = (jobInfo: JobPosting): Observable<JobPosting> => {
    return this.apiService.post('/api/jobpostings/update', jobInfo).pipe(
      map(data => {
        return data;
      })
    );
  };

  jobPost = (jobInfo: JobPosting): Observable<JobPosting> => {
    return this.apiService.post('/api/jobpostings/create', jobInfo).pipe(
      map(data => {
        return data;
      })
    );
  };

  getEmployers = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/employers/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  getIndustries = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/industries/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  getSkill = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/skill-tags/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  profile = (params?) => {
    return this.apiService.get('/api/employers/profile', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  profileView = (params?) => {
    return this.apiService.get('/api/employers/view', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  getPostedJob = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/jobpostings/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  getPostedJobDetails = (params: any): Observable<GetViewResponse> => {
    return this.apiService.get('/api/jobpostings/view', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  deletePostedJob = (params: any): Observable<any> => {
    return this.apiService.post('/api/jobpostings/delete', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  changeJobStatus = (params: any): Observable<any> => {
    return this.apiService.post('/api/jobpostings/change-status', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  changeEmployerStatus = (params: any): Observable<any> => {
    return this.apiService.post('/api/employers/change-status', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  getJobScoring = (params?) => {
    return this.apiService.get('/api/jobpostings/job-scoring', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  applicationsList = (params?) => {
    return this.apiService.get('/api/jobpostings/applications/list', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  sendMail = (params: any): Observable<any> => {
    return this.apiService.get('/api/jobpostings/send-email', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  updateCompanyProfile = (params) => {
    return this.apiService.post('/api/employers/update-company-profile', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  getCompanyProfileInfo = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/employers/company-profile', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  photoUpdate = (params?) => {
    return this.apiService.post('/api/employers/update-photo', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  shortListUser = (params?) => {
    return this.apiService.post('/api/jobpostings/applications/short-list-user', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  saveProfile = (params?) => {
    return this.apiService.post('/api/employers/save-profile', params).pipe(
      map(data => {
        return data;
      })
    );
  }

  savedProfiles = (params?) => {
    return this.apiService.get('/api/employers/saved-profiles', params).pipe(
      map(data => {
        return data;
      })
    );
  }

}
