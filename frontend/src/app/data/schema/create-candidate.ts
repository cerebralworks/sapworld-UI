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
  type: string;
  description: string;
  salary_type: number;
  salary_currency: number;
  salary: number;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  availability: string;
  remote: boolean;
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
}
