import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Visitor, CreateVisitorRequest, UpdateVisitorRequest } from '../models/visitor.model';

@Injectable({ providedIn: 'root' })
export class VisitorService {
  private readonly apiUrl = '/api/visitors';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(this.apiUrl);
  }

  getById(id: string): Observable<Visitor> {
    return this.http.get<Visitor>(`${this.apiUrl}/${id}`);
  }

  search(term: string): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(`${this.apiUrl}/search`, { params: { term } });
  }

  create(request: CreateVisitorRequest): Observable<Visitor> {
    return this.http.post<Visitor>(this.apiUrl, request);
  }

  update(id: string, request: UpdateVisitorRequest): Observable<Visitor> {
    return this.http.put<Visitor>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
