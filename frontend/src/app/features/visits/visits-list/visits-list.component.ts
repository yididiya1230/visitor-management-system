import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VisitService } from '../../../core/services/visit.service';
import { Visit } from '../../../core/models/visit.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-visits-list',
  standalone: true,
  imports: [
    RouterLink, NgFor, NgIf, DatePipe,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatTabsModule, MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>Visits</h1>
      <div class="header-actions">
        <button mat-raised-button color="primary" routerLink="/visits/new" *ngIf="canEdit">
          <mat-icon>add</mat-icon> New Visit
        </button>
      </div>
    </div>

    <mat-card>
      <mat-card-content>
        <nav mat-tab-nav-bar>
          <a mat-tab-link (click)="filter = 'all'" [active]="filter === 'all'">All</a>
          <a mat-tab-link (click)="filter = 'active'" [active]="filter === 'active'">Active</a>
        </nav>

        <table mat-table [dataSource]="filteredVisits" class="full-table">
          <ng-container matColumnDef="visitor">
            <th mat-header-cell *matHeaderCellDef>Visitor</th>
            <td mat-cell *matCellDef="let v">{{ v.visitorName }}</td>
          </ng-container>
          <ng-container matColumnDef="host">
            <th mat-header-cell *matHeaderCellDef>Host</th>
            <td mat-cell *matCellDef="let v">{{ v.hostName }}</td>
          </ng-container>
          <ng-container matColumnDef="purpose">
            <th mat-header-cell *matHeaderCellDef>Purpose</th>
            <td mat-cell *matCellDef="let v">{{ v.purpose }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let v">
              <span class="status-badge" [class.checked-in]="v.status === 'CheckedIn'"
                    [class.checked-out]="v.status === 'CheckedOut'"
                    [class.pending]="v.status === 'Pending'"
                    [class.cancelled]="v.status === 'Cancelled'">
                {{ v.status }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let v">
              <button mat-raised-button color="accent" (click)="checkIn(v.id)"
                      *ngIf="v.status === 'Pending' && canEdit" class="action-btn">
                Check In
              </button>
              <button mat-raised-button (click)="checkOut(v.id)"
                      *ngIf="v.status === 'CheckedIn' && canEdit" class="action-btn">
                Check Out
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <p class="no-data" *ngIf="filteredVisits.length === 0">No visits found</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a237e; }
    .header-actions { display: flex; gap: 12px; }
    .full-table { width: 100%; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .checked-in { background: #e8f5e9; color: #2e7d32; }
    .checked-out { background: #e3f2fd; color: #0277bd; }
    .pending { background: #fff3e0; color: #e65100; }
    .cancelled { background: #fce4ec; color: #c62828; }
    .action-btn { margin: 0 4px; padding: 2px 12px; font-size: 12px; line-height: 28px; }
    .no-data { text-align: center; padding: 24px; color: #999; }
  `]
})
export class VisitsListComponent implements OnInit {
  visits: Visit[] = [];
  filter: 'all' | 'active' = 'all';
  displayedColumns = ['visitor', 'host', 'purpose', 'status', 'actions'];
  canEdit = false;

  get filteredVisits(): Visit[] {
    if (this.filter === 'active') {
      return this.visits.filter(v => v.status === 'CheckedIn' || v.status === 'Pending');
    }
    return this.visits;
  }

  constructor(
    private visitService: VisitService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    const role = this.authService.getRole();
    this.canEdit = role === 'Admin' || role === 'Receptionist';
  }

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits(): void {
    this.visitService.getAll().subscribe({
      next: (data) => this.visits = data
    });
  }

  checkIn(id: string): void {
    this.visitService.checkIn(id).subscribe({
      next: () => {
        this.snackBar.open('Visitor checked in', 'Close', { duration: 3000 });
        this.loadVisits();
      }
    });
  }

  checkOut(id: string): void {
    const notes = prompt('Add checkout notes (optional):');
    this.visitService.checkOut(id, notes || undefined).subscribe({
      next: () => {
        this.snackBar.open('Visitor checked out', 'Close', { duration: 3000 });
        this.loadVisits();
      }
    });
  }
}
