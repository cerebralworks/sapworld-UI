export interface AccountLogin {
  email: string;
  password: string;
  isLoggedIn: boolean;
  message: string;
  role: string;
}

export interface LoggedIn {
  success: boolean;
  userId: string;
  isLoggedIn: boolean;
  role: Array<any>
}

export interface AccountSignup {
  data: any;
  success: boolean;
  message: string;
  id: string;
  userId: string;
}

export interface VerifyAccount {
  id: any;
  token: string;
}

