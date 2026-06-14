export interface Host {
  id: string;
  employeeCode: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  departmentName: string;
  departmentId: string;
}

export interface CreateHostRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  employeeCode: string;
  jobTitle: string;
  departmentId: string;
}

export interface UpdateHostRequest {
  fullName: string;
  phoneNumber?: string;
  employeeCode: string;
  jobTitle: string;
  departmentId: string;
}
