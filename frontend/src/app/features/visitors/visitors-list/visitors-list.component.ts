import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VisitorService } from '../../../core/services/visitor.service';
import { Visitor } from '../../../core/models/visitor.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-visitors-list',
  standalone: true,
  imports: [
    RouterLink, NgIf, DatePipe, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>Visitors</h1>
      <div class="header-actions">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search visitors...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Name, phone, company...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" routerLink="/visitors/new" *ngIf="canEdit">
          <mat-icon>add</mat-icon> New Visitor
        </button>
      </div>
    </div>

    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="visitors" class="full-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let v">{{ v.fullName }}</td>
          </ng-container>
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let v">{{ v.phoneNumber }}</td>
          </ng-container>
          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let v">{{ v.company || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="idCard">
            <th mat-header-cell *matHeaderCellDef>ID Card</th>
            <td mat-cell *matCellDef="let v">{{ v.idCardNumber || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="created">
            <th mat-header-cell *matHeaderCellDef>Registered</th>
            <td mat-cell *matCellDef="let v">{{ v.createdAt | date }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let v">
              <button mat-icon-button color="primary" [routerLink]="['/visitors', v.id, 'edit']" *ngIf="canEdit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteVisitor(v.id)" *ngIf="isAdmin">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <p class="no-data" *ngIf="visitors.length === 0">No visitors found</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a237e; }
    .header-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .search-field { width: 300px; }
    .full-table { width: 100%; }
    .no-data { text-align: center; padding: 24px; color: #999; }
  `]
})
export class VisitorsListComponent implements OnInit {
  visitors: Visitor[] = [];
  searchTerm = '';
  displayedColumns = ['name', 'phone', 'company', 'idCard', 'created', 'actions'];
  canEdit = false;
  isAdmin = false;

  constructor(
    private visitorService: VisitorService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    const role = this.authService.getRole();
    this.canEdit = role === 'Admin' || role === 'Receptionist';
    this.isAdmin = role === 'Admin';
  }

  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors(): void {
    this.visitorService.getAll().subscribe({
      next: (data) => this.visitors = data,
      error: () => this.snackBar.open('Failed to load visitors', 'Close', { duration: 3000 })
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.visitorService.search(this.searchTerm).subscribe({
        next: (data) => this.visitors = data
      });
    } else {
      this.loadVisitors();
    }
  }

  deleteVisitor(id: string): void {
    if (confirm('Are you sure you want to delete this visitor?')) {
      this.visitorService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Visitor deleted', 'Close', { duration: 3000 });
          this.loadVisitors();
        }
      });
    }
  }
}
