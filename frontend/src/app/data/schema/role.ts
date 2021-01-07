export enum Role {
  User = 0,
  Employer = 1,
  Agency = 2,
  Admin = 3,
}

export interface RoleInfo {
  roleName: string;
  roleId: number;
}
