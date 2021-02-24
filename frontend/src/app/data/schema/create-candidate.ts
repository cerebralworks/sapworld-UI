export interface tabInfo {
  tabNumber: number;
  tabName: string
}

export interface tabProgressor {
  currentTab: number;
  currentTabName: string;
  nextTab: number;
  nextTabName: string;
  btnType: string;
}

export interface CandidateProfile {
  id: number;
  title: string;
  job_type: number;
  description: string;
  salary_type: number;
  salary_currency: number;
  salary: number;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  availability: number;
  remote_only: boolean;
  experience: number;
  sap_experience: number;
  latlng: string;
  location: string;
  domain: Array<number>;
  hands_on_experience: Array<any>;
  extra_criteria: Array<any>;
  temp_extra_criteria: Array<any>;
  skills: Array<number>;
  programming_skills: Array<string>;
  optinal_skills: Array<string>;
  certification: Array<string>;
  work_authorization: number;
  visa_sponsorship: boolean;
  company: number;
  end_to_end_implementation: number;
  contract_duration: number;
  education_qualification: any[];
  domains_worked: any[];
  other_skills: any[];
  job_role: string;
  clients_worked:  any[];
  willing_to_relocate: boolean;
  travel: number;
  phone: any;
  email: string;
  job_application: any
  privacy_protection: any
}
