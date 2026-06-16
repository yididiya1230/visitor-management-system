export interface Visit {
  id: string;
  visitorName: string;
  hostName: string;
  departmentName: string;
  purpose: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  badgeCode?: string;
  notes?: string;
  visitorId: string;
  hostId: string;
  createdAt: string;
}

export interface CreateVisitRequest {
  visitorId: string;
  hostId: string;
  purpose: string;
  notes?: string;
}

export interface UpdateVisitRequest {
  visitorId: string;
  hostId: string;
  purpose: string;
  notes?: string;
}

export interface CheckInRequest {
  visitId: string;
}

export interface CheckOutRequest {
  visitId: string;
  notes?: string;
}
