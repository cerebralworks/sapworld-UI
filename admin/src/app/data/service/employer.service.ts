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
	
	//collecting Technical Skill data
  getTechskill = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/program/list',params).pipe(
      map(data => {
        return data;
      })
    );
  };
  //creating the Technical skill data
  postTechskill =(data : any): Observable<any> => {
    return this.apiService.post('/api/program/create', data).pipe(
      map(data => {
        return data;
      })
    );
  };
  //deleting the Technical skil data
  deleteTechskill = (params: any): Observable<any> => {
    return this.apiService.delete('/api/program/delete/'+ params).pipe(
      map(data => {
        return data;
      })
    );
  };
  //update Technical skill Data
  updateTechskill = (id: any , data : any): Observable<any> => {
    return this.apiService.post('/api/program/update/'+id, data).pipe(
      map(data => {
        return data;
      })
    );
  };


	profile = (params?) => {
    return this.apiService.get('/api/admins/profile', params).pipe(
      map(data => {
        return data;
      })
    );
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
  getEmployersDetails = (params: any): Observable<GetResponse> => {
    return this.apiService.post('/api/admin/dashboard/details', params).pipe(
      map(data => {
        return data;
      })
    );
  };
  getEmployersCount = (): Observable<GetResponse> => {
    return this.apiService.get('/api/admin/dashboard').pipe(
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
    return this.apiService.post('/api/admins/create', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  sendMailUser = (params) => {
    return this.apiService.post('/api/admins/profile-complete-invite', params).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  
  getCompanyProfileInfo = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/admins/profile', params).pipe(
      map(data => {
        return data;
      })
    );
  };

  photoUpdate = (params?) => {
    return this.apiService.post('/api/admins/update-photo', params).pipe(
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

  //Get country
  getCountry = (): Observable<GetResponse> => {
    return this.apiService.get('/api/country/list?limit=1000').pipe(
      map(data => {
        return data;
      })
    );
  };
  //collecting workautherization data
  getWorkauth = (params: any): Observable<GetResponse> => {
    return this.apiService.get('/api/workauthorization/list',params).pipe(
      map(data => {
        return data;
      })
    );
  };
  //deleting the workautherization data
  deleteWrkauth = (params: any): Observable<any> => {
    return this.apiService.delete('/api/workauthorization/delete/'+ params).pipe(
      map(data => {
        return data;
      })
    );
  };
  //posting the workautherization data
  postWorkauth =(data : any): Observable<any> => {
    return this.apiService.post('/api/workauthorization/create', data).pipe(
      map(data => {
        return data;
      })
    );
  };
  //update  workautherization Data
  updateWrkauth = (id: any , data : any): Observable<any> => {
    return this.apiService.post('/api/workauthorization/update/'+id, data).pipe(
      map(data => {
        return data;
      })
    );
  };
  //creating the industry data
  postIndustries =(data : any): Observable<any> => {
    return this.apiService.post('/api/industries/create', data).pipe(
      map(data => {
        return data;
      })
    );
  };
  //deleting the Industry data
  deleteIndustry = (params: any): Observable<any> => {
    return this.apiService.delete('/api/industries/delete/'+ params).pipe(
      map(data => {
        return data;
      })
    );
  };
  //update Industry Data
  updateIndustry = (id: any , data : any): Observable<any> => {
    return this.apiService.post('/api/industries/update/'+id, data).pipe(
      map(data => {
        return data;
      })
    );
  };
  
  
  //creating the skills
  createSkills(data : any){
    return this.apiService.post('/api/skill-tags/creates',data)
  }
  //deleting the skills
  deleteskill = (params: any): Observable<any> => {
    return this.apiService.delete('/api/skill-tags/delete/'+ params).pipe(
      map(data => {
        return data;
      })
    );
  };
  //update skills
  updateskill = (id: any , data : any): Observable<any> => {
    return this.apiService.post('/api/skill-tags/update/'+id, data).pipe(
      map(data => {
        return data;
      })
    );
  };
}
