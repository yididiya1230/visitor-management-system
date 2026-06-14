import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HostService } from '../../../core/services/host.service';
import { Host } from '../../../core/models/host.model';

@Component({
  selector: 'app-hosts-list',
  standalone: true,
  imports: [
    RouterLink, NgFor, NgIf,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>Hosts / Employees</h1>
      <button mat-raised-button color="primary" routerLink="/hosts/new">
        <mat-icon>add</mat-icon> New Host
      </button>
    </div>

    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="hosts" class="full-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let h">{{ h.fullName }}</td>
          </ng-container>
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Employee Code</th>
            <td mat-cell *matCellDef="let h">{{ h.employeeCode }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let h">{{ h.email }}</td>
          </ng-container>
          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let h">{{ h.departmentName }}</td>
          </ng-container>
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Job Title</th>
            <td mat-cell *matCellDef="let h">{{ h.jobTitle }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let h">
              <button mat-icon-button color="warn" (click)="deleteHost(h.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <p class="no-data" *ngIf="hosts.length === 0">No hosts found</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a237e; }
    .full-table { width: 100%; }
    .no-data { text-align: center; padding: 24px; color: #999; }
  `]
})
export class HostsListComponent implements OnInit {
  hosts: Host[] = [];
  displayedColumns = ['name', 'code', 'email', 'department', 'title', 'actions'];

  constructor(
    private hostService: HostService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.hostService.getAll().subscribe(data => this.hosts = data);
  }

  deleteHost(id: string): void {
    if (confirm('Delete this host?')) {
      this.hostService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Host deleted', 'Close', { duration: 3000 });
          this.hosts = this.hosts.filter(h => h.id !== id);
        }
      });
    }
  }
}
