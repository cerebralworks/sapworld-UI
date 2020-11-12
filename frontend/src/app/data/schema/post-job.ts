export interface JobPosting {
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
  domain: Array<number>;
  hands_on_experience: Array<{}>;
  skills: Array<number>;
  programming_skills: Array<string>;
  optinal_skills: Array<string>;
  certification: Array<string>;
  work_authorization: number;
  visa_sponsorship: boolean;
  end_to_end_implementation: number;
}

