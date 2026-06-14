export interface DashboardData {
  totalVisitors: number;
  activeVisitors: number;
  checkedOutToday: number;
  totalHosts: number;
  todayVisits: number;
  pendingVisits: number;
  recentVisits: RecentVisit[];
}

export interface RecentVisit {
  id: string;
  visitorName: string;
  hostName: string;
  purpose: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
}
