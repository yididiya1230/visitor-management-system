export interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  company?: string;
  photoUrl?: string;
  idCardNumber?: string;
  address?: string;
  createdAt: string;
  fullName: string;
}

export interface CreateVisitorRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  company?: string;
  idCardNumber?: string;
  address?: string;
}

export interface UpdateVisitorRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  company?: string;
  idCardNumber?: string;
  address?: string;
}
