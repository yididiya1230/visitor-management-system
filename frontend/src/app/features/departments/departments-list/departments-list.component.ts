import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';

@Component({
  selector: 'app-departments-list',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgIf,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>Departments</h1>
    </div>

    <div class="dept-grid">
      <mat-card class="add-card">
        <mat-card-content>
          <form [formGroup]="deptForm" (ngSubmit)="onSubmit()">
            <h3>Add Department</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Department Name</mat-label>
              <input matInput formControlName="name" required>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description (Optional)</mat-label>
              <input matInput formControlName="description">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="deptForm.invalid">
              Add
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="list-card">
        <mat-card-content>
          <table mat-table [dataSource]="departments" class="full-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let d">{{ d.name }}</td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let d">{{ d.description || '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let d">
                <button mat-icon-button color="warn" (click)="deleteDept(d.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <p class="no-data" *ngIf="departments.length === 0">No departments</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #2e7d32; }
    .dept-grid { display: grid; grid-template-columns: 400px 1fr; gap: 24px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .full-table { width: 100%; }
    .no-data { text-align: center; padding: 24px; color: #999; }
  `]
})
export class DepartmentsListComponent implements OnInit {
  departments: Department[] = [];
  deptForm: FormGroup;
  displayedColumns = ['name', 'description', 'actions'];

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {
    this.deptForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.departmentService.getAll().subscribe(data => this.departments = data);
  }

  onSubmit(): void {
    if (this.deptForm.invalid) return;

    this.departmentService.create(this.deptForm.value).subscribe({
      next: (dept) => {
        this.departments.push(dept);
        this.deptForm.reset();
        this.snackBar.open('Department added', 'Close', { duration: 3000 });
      }
    });
  }

  deleteDept(id: string): void {
    if (confirm('Delete this department?')) {
      this.departmentService.delete(id).subscribe({
        next: () => {
          this.departments = this.departments.filter(d => d.id !== id);
          this.snackBar.open('Department deleted', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
