import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Host, CreateHostRequest, UpdateHostRequest } from '../models/host.model';

@Injectable({ providedIn: 'root' })
export class HostService {
  private readonly apiUrl = '/api/hosts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Host[]> {
    return this.http.get<Host[]>(this.apiUrl);
  }

  getById(id: string): Observable<Host> {
    return this.http.get<Host>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateHostRequest): Observable<Host> {
    return this.http.post<Host>(this.apiUrl, request);
  }

  update(id: string, request: UpdateHostRequest): Observable<Host> {
    return this.http.put<Host>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
