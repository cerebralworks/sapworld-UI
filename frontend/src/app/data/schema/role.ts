export enum Role {
  User = 'user',
  Agency = 'agency',
  Employer = 'employer',
  Admin = 'admin',
}

export interface RoleInfo {
  roleName: string;
  roleId: number;
}
