import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardData } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink, NgFor, NgIf, NgStyle,
    MatCardModule, MatIconModule, MatButtonModule,
    MatTableModule, MatChipsModule
  ],
  template: `
    <div class="dashboard-welcome">
      <h1>Welcome to ECX Visitor Management</h1>
      <p>Visitor Registration and Access Control Platform</p>
    </div>

    <div class="stats-grid">
      <mat-card class="stat-card" *ngFor="let stat of stats">
        <div class="stat-icon" [ngStyle]="{'background': stat.color}">
          <mat-icon>{{ stat.icon }}</mat-icon>
        </div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </mat-card>
    </div>

    <div class="dashboard-actions">
      <button mat-raised-button color="primary" routerLink="/visitors/new">
        <mat-icon>person_add</mat-icon> Register Visitor
      </button>
      <button mat-raised-button color="accent" routerLink="/visits/new">
        <mat-icon>login</mat-icon> New Visit
      </button>
      <button mat-raised-button routerLink="/visitors">
        <mat-icon>search</mat-icon> Search Visitor
      </button>
    </div>

    <mat-card class="recent-card">
      <mat-card-header>
        <mat-card-title>Recent Visitor Activity</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="recentVisits" class="full-table">
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
                    [class.pending]="v.status === 'Pending'">
                {{ v.status }}
              </span>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <p class="no-data" *ngIf="recentVisits.length === 0">No recent activity</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .dashboard-welcome { margin-bottom: 24px; }
    .dashboard-welcome h1 { font-size: 28px; font-weight: 700; color: #1a237e; }
    .dashboard-welcome p { color: #666; margin-top: 4px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .stat-card { padding: 24px; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .stat-icon mat-icon { font-size: 28px; color: white; width: 28px; height: 28px; }
    .stat-value { font-size: 32px; font-weight: 700; margin-bottom: 4px; }
    .stat-label { font-size: 14px; color: #666; font-weight: 500; }
    .dashboard-actions { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .dashboard-actions button { display: flex; align-items: center; gap: 8px; padding: 6px 24px; }
    .recent-card { margin-top: 0; }
    .full-table { width: 100%; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .checked-in { background: #e8f5e9; color: #2e7d32; }
    .checked-out { background: #e3f2fd; color: #0277bd; }
    .pending { background: #fff3e0; color: #e65100; }
    .no-data { text-align: center; padding: 24px; color: #999; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];
  recentVisits: any[] = [];
  displayedColumns = ['visitor', 'host', 'purpose', 'status'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data: DashboardData) => {
        this.stats = [
          { label: "Today's Visitors", value: data.todayVisits, icon: 'today', color: '#1a237e' },
          { label: 'Active Visitors', value: data.activeVisitors, icon: 'groups', color: '#2e7d32' },
          { label: 'Checked Out Today', value: data.checkedOutToday, icon: 'output', color: '#0277bd' },
          { label: 'Total Hosts', value: data.totalHosts, icon: 'badge', color: '#e65100' }
        ];
        this.recentVisits = data.recentVisits;
      }
    });
  }
}
