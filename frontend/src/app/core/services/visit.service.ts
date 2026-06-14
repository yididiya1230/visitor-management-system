import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Visit, CreateVisitRequest, CheckOutRequest } from '../models/visit.model';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private readonly apiUrl = '/api/visits';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.apiUrl);
  }

  getById(id: string): Observable<Visit> {
    return this.http.get<Visit>(`${this.apiUrl}/${id}`);
  }

  getActive(): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.apiUrl}/active`);
  }

  getByVisitor(visitorId: string): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.apiUrl}/by-visitor/${visitorId}`);
  }

  getByHost(hostId: string): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.apiUrl}/by-host/${hostId}`);
  }

  create(request: CreateVisitRequest): Observable<Visit> {
    return this.http.post<Visit>(this.apiUrl, request);
  }

  checkIn(id: string): Observable<Visit> {
    return this.http.post<Visit>(`${this.apiUrl}/${id}/check-in`, {});
  }

  checkOut(id: string, notes?: string): Observable<Visit> {
    return this.http.post<Visit>(`${this.apiUrl}/${id}/check-out`, { notes } as CheckOutRequest);
  }

  cancel(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
