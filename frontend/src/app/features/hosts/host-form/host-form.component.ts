import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HostService } from '../../../core/services/host.service';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';

@Component({
  selector: 'app-host-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, NgFor, NgIf,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>New Host / Employee</h1>
    </div>

    <mat-card>
      <mat-card-content>
        <form [formGroup]="hostForm" (ngSubmit)="onSubmit()" class="host-form">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Employee Code</mat-label>
              <input matInput formControlName="employeeCode" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Job Title</mat-label>
              <input matInput formControlName="jobTitle" required>
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Department</mat-label>
            <mat-select formControlName="departmentId" required>
              <mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone (Optional)</mat-label>
            <input matInput formControlName="phoneNumber">
            <mat-error *ngIf="hostForm.get('phoneNumber')?.invalid && hostForm.get('phoneNumber')?.touched">
              Enter a valid phone number
            </mat-error>
          </mat-form-field>
          <div class="form-actions">
            <button mat-button routerLink="/hosts">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="hostForm.invalid">
              Create Host
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a237e; }
    .host-form { max-width: 700px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class HostFormComponent implements OnInit {
  hostForm: FormGroup;
  departments: Department[] = [];

  constructor(
    private fb: FormBuilder,
    private hostService: HostService,
    private departmentService: DepartmentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.hostForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      employeeCode: ['', Validators.required],
      jobTitle: ['', Validators.required],
      departmentId: ['', Validators.required],
      phoneNumber: ['', Validators.pattern(/^\+?[\d\s\-\(\)]{7,15}$/)]
    });
  }

  ngOnInit(): void {
    this.departmentService.getAll().subscribe(data => this.departments = data);
  }

  onSubmit(): void {
    if (this.hostForm.invalid) return;

    this.hostService.create(this.hostForm.value).subscribe({
      next: () => {
        this.snackBar.open('Host created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/hosts']);
      }
    });
  }
}
