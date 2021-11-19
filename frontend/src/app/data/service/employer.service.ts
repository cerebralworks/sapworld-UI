import { Injectable } from '@angular/core';
// import { CacheService } from '@shared/service/cache.service';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ApiService } from '@shared/service/api.service';
import { JobPosting } from '@data/schema/post-job';
import { GetResponse, GetViewResponse } from '@data/schema/response';
import { CacheService } from '@shared/service/cache.service';


@Injectable({
  providedIn: 'root'
})
export class EmployerService extends CacheService {

  constructor(private apiService: ApiService) {
    super();
  }
  createcontact = (data) => {
    return this.apiService.post('/api/contact/create',data).pipe(
      map(data => {
        return data;
      })
    );
  };
  /**
   * To update the employer profile details
   */
	update = (params?) => {
    return this.apiService.post('/api/employers/update', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  
  /**
   * To update the job details
   */
  jobUpdate = (jobInfo: JobPosting): Observable<JobPosting> => {
    return this.apiService.post('/api/jobpostings/update', jobInfo).pipe(
      map(data => {
        return data;
      })
    );
  };

	/**
   * To create a new job
   */
  jobPost = (jobInfo: JobPosting): Observable<JobPosting> => {
    return this.apiService.post('/api/jobpostings/create', jobInfo).pipe(
      map(data => {
        return data;
      })
    );
  };
  //creating the skills
  createSkills = (data : any): Observable<JobPosting> => {
    return this.apiService.post('/api/skill-tags/creates', data).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /**
   * To get the employer dashboard details
   */
  getEmployeeDashboard = (params?) => {
    return this.apiService.post('/api/employers/employers-dashboard', params).pipe(
      map(data => {
        return data;
      })
    );
  };

	/**
   * To get the industries details
   */
  getIndustries = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/industries/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };
   
   /**
   * To get the program details
   */
   
  getProgram = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/program/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };
	
   /**
   * To get the skills details
   */
   
  getSkill = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/skill-tags/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /**
   * To get the notification details
   */
  onGetNotification = (params: any): Observable<GetResponse> => {
    return this.apiService.post('/api/notification/count',params).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  onGetNotificationDetails = (params: any): Observable<GetResponse> => {
    return this.apiService.post('/api/notification/details',params).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /**
   * To get the language details
   */
  getLanguage = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/language/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /**
   * To get the country details
   */
  getCountry = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/country/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };

   /**
   * To get the employer details
   */
  profile = (params?) => {
    return this.apiService.get('/api/employers/profile', params).pipe(
      map(data => {
        return data;
      })
    );
  }
   
   /**
   * To get the posted job details
   */
  getPostedJob = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/jobpostings/list', params).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  /**
   * To get the posted job count details
   */
  getPostedJobCount = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/jobpostings/list/users/count', params).pipe(
      map(data => {
        return data;
      })
    );
  };

	/**
   * To get the posted job details based on the ID
   */
  getPostedJobDetails = (params: any): Observable<GetViewResponse> => {
    return this.apiService.get('/api/jobpostings/view', params).pipe(
      map(data => {
        return data;
      })
    );
  };
	
	/**
   * To delete the posted job details
   */
  deletePostedJob = (params: any): Observable<any> => {
    return this.apiService.post('/api/jobpostings/delete', params).pipe(
      map(data => {
        return data;
      })
    );
  };

   /**
   * To change the job status details
   */
   
  changeJobStatus = (params: any): Observable<any> => {
    return this.apiService.post('/api/jobpostings/change-status', params).pipe(
      map(data => {
        return data;
      })
    );
  };

   /**
   * To get the job scoring details
   */
  getJobScoring = (params?) => {
    return this.apiService.post('/api/jobpostings/job-scoring', params).pipe(
      map(data => {
        return data;
      })
    );
  }

   /**
   * To get the application list details
   */
  applicationsList = (params?) => {
    return this.apiService.get('/api/jobpostings/applications/list', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  
  /**
   * To get the application data details
   */
   
  applicationsData = (params?) => {
    return this.apiService.get('/api/jobpostings/applications/view/'+params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To send the email for the job posting
   */
  sendMail = (params: any): Observable<any> => {
    return this.apiService.get('/api/jobpostings/send-email', params).pipe(
      map(data => {
        return data;
      })
    );
  };
  /**
   * To update the company details
   */
  updateCompanyProfile = (params) => {
    return this.apiService.post('/api/employers/update-company-profile', params).pipe(
      map(data => {
        return data;
      })
    );
  };
  /**
   * To update the company profile details
   */
  getCompanyProfileInfo = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/employers/company-profile', params).pipe(
      map(data => {
        return data;
      })
    );
  };
  /**
   * To update the user profile details
   */
  photoUpdate = (params?) => {
    return this.apiService.post('/api/employers/update-photo', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To get the shortlisted user details
   */
  shortListUser = (params?) => {
    return this.apiService.post('/api/jobpostings/applications/short-list-user', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To save the jobseeker profile
   */
  saveProfile = (params?) => {
    return this.apiService.post('/api/employers/save-profile', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To get the jobseeker saved profile details
   */
  savedProfiles = (params?) => {
    return this.apiService.get('/api/employers/saved-profiles', params).pipe(
      map(data => {
        return data;
      })
    );
  }
  /**
   * To update the user profile details
   */
  savelogs = (params?) => {
    return this.apiService.post('/api/logs', params).pipe(
      map(data => {
        return data;
      })
    );
  }
}
