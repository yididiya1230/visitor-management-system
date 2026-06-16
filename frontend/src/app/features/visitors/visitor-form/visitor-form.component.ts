import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VisitorService } from '../../../core/services/visitor.service';

@Component({
  selector: 'app-visitor-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, NgIf,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>{{ isEdit ? 'Edit' : 'Register' }} Visitor</h1>
    </div>

    <mat-card>
      <mat-card-content>
        <form [formGroup]="visitorForm" (ngSubmit)="onSubmit()" class="visitor-form">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" required>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-error *ngIf="visitorForm.get('email')?.invalid && visitorForm.get('email')?.touched">
                Enter a valid email address
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Phone Number</mat-label>
              <input matInput formControlName="phoneNumber" required>
              <mat-error *ngIf="visitorForm.get('phoneNumber')?.invalid && visitorForm.get('phoneNumber')?.touched">
                <span *ngIf="visitorForm.get('phoneNumber')?.errors?.['required']">Phone number is required</span>
                <span *ngIf="visitorForm.get('phoneNumber')?.errors?.['pattern']">Enter a valid phone number</span>
              </mat-error>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Company</mat-label>
              <input matInput formControlName="company">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>ID Card Number</mat-label>
              <input matInput formControlName="idCardNumber">
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address</mat-label>
            <textarea matInput formControlName="address" rows="2"></textarea>
          </mat-form-field>
          <div class="form-actions">
            <button mat-button routerLink="/visitors">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="visitorForm.invalid">
              {{ isEdit ? 'Update' : 'Register' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a237e; }
    .visitor-form { max-width: 800px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0; }
    .full-width { width: 100%; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class VisitorFormComponent implements OnInit {
  visitorForm: FormGroup;
  isEdit = false;
  visitorId = '';

  constructor(
    private fb: FormBuilder,
    private visitorService: VisitorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.visitorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{7,15}$/)]],
      company: [''],
      idCardNumber: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.visitorId = this.route.snapshot.params['id'];
    if (this.visitorId) {
      this.isEdit = true;
      this.visitorService.getById(this.visitorId).subscribe({
        next: (v) => this.visitorForm.patchValue(v)
      });
    }
  }

  onSubmit(): void {
    if (this.visitorForm.invalid) return;

    const request = this.visitorForm.value;

    if (this.isEdit) {
      this.visitorService.update(this.visitorId, request).subscribe({
        next: () => {
          this.snackBar.open('Visitor updated', 'Close', { duration: 3000 });
          this.router.navigate(['/visitors']);
        }
      });
    } else {
      this.visitorService.create(request).subscribe({
        next: () => {
          this.snackBar.open('Visitor registered', 'Close', { duration: 3000 });
          this.router.navigate(['/visitors']);
        }
      });
    }
  }
}
