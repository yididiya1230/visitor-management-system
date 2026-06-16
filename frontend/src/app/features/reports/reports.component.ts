import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, NgIf, DatePipe,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>Reports</h1>
    </div>

    <div class="reports-grid">
      <mat-card>
        <mat-card-header><mat-card-title>Daily Report</mat-card-title></mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="reportDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="loadDailyReport()">
            <mat-icon>search</mat-icon> Generate
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header><mat-card-title>Date Range Report</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="date-range">
            <mat-form-field appearance="outline">
              <mat-label>Start Date</mat-label>
              <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>End Date</mat-label>
              <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
          </div>
          <button mat-raised-button color="primary" (click)="loadRangeReport()">
            <mat-icon>search</mat-icon> Generate
          </button>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-card class="report-results" *ngIf="reportData">
      <mat-card-header>
        <mat-card-title>Report - {{ reportDate | date }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="report-stats">
          <div class="rstat">Total: <strong>{{ reportData.totalVisits }}</strong></div>
          <div class="rstat">Checked In: <strong>{{ reportData.checkedIn }}</strong></div>
          <div class="rstat">Checked Out: <strong>{{ reportData.checkedOut }}</strong></div>
          <div class="rstat">Cancelled: <strong>{{ reportData.cancelled }}</strong></div>
        </div>
        <table mat-table [dataSource]="reportData.visits" class="full-table">
          <ng-container matColumnDef="visitor">
            <th mat-header-cell *matHeaderCellDef>Visitor</th>
            <td mat-cell *matCellDef="let v">{{ v.visitorName }}</td>
          </ng-container>
          <ng-container matColumnDef="host">
            <th mat-header-cell *matHeaderCellDef>Host</th>
            <td mat-cell *matCellDef="let v">{{ v.hostName }}</td>
          </ng-container>
          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let v">{{ v.department }}</td>
          </ng-container>
          <ng-container matColumnDef="purpose">
            <th mat-header-cell *matHeaderCellDef>Purpose</th>
            <td mat-cell *matCellDef="let v">{{ v.purpose }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let v">{{ v.status }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: reportColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a237e; }
    .reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .date-range { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .report-stats { display: flex; gap: 32px; margin-bottom: 20px; padding: 16px; background: #f5f7fa; border-radius: 8px; }
    .rstat { font-size: 15px; }
    .full-table { width: 100%; }
  `]
})
export class ReportsComponent {
  reportDate = new Date();
  startDate = new Date();
  endDate = new Date();
  reportData: any = null;
  reportColumns = ['visitor', 'host', 'department', 'purpose', 'status'];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  loadDailyReport(): void {
    const dateStr = this.reportDate.toISOString().split('T')[0];
    this.http.get(`/api/reports/daily?date=${dateStr}`).subscribe({
      next: (data) => this.reportData = data,
      error: () => this.snackBar.open('Failed to load report', 'Close', { duration: 3000 })
    });
  }

  loadRangeReport(): void {
    this.http.post('/api/reports/date-range', {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString()
    }).subscribe({
      next: (data) => this.reportData = data,
      error: () => this.snackBar.open('Failed to load report', 'Close', { duration: 3000 })
    });
  }
}
