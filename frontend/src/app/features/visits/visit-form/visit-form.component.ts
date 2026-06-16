import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VisitService } from '../../../core/services/visit.service';
import { VisitorService } from '../../../core/services/visitor.service';
import { HostService } from '../../../core/services/host.service';
import { Visitor } from '../../../core/models/visitor.model';
import { Host } from '../../../core/models/host.model';

@Component({
  selector: 'app-visit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, NgFor,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>{{ isEdit ? 'Edit' : 'New' }} Visit</h1>
    </div>

    <mat-card>
      <mat-card-content>
        <form [formGroup]="visitForm" (ngSubmit)="onSubmit()" class="visit-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Visitor</mat-label>
            <mat-select formControlName="visitorId" required>
              <mat-option *ngFor="let v of visitors" [value]="v.id">
                {{ v.fullName }} - {{ v.company || v.phoneNumber }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Host</mat-label>
            <mat-select formControlName="hostId" required>
              <mat-option *ngFor="let h of hosts" [value]="h.id">
                {{ h.fullName }} ({{ h.departmentName }})
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Purpose of Visit</mat-label>
            <textarea matInput formControlName="purpose" rows="3" required></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes (Optional)</mat-label>
            <textarea matInput formControlName="notes" rows="2"></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button routerLink="/visits">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="visitForm.invalid">
              {{ isEdit ? 'Update' : 'Create' }} Visit
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a237e; }
    .visit-form { max-width: 600px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class VisitFormComponent implements OnInit {
  visitForm: FormGroup;
  visitors: Visitor[] = [];
  hosts: Host[] = [];
  isEdit = false;
  visitId = '';

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private visitorService: VisitorService,
    private hostService: HostService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.visitForm = this.fb.group({
      visitorId: ['', Validators.required],
      hostId: ['', Validators.required],
      purpose: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.visitorService.getAll().subscribe(data => this.visitors = data);
    this.hostService.getAll().subscribe(data => this.hosts = data);

    this.visitId = this.route.snapshot.params['id'];
    if (this.visitId) {
      this.isEdit = true;
      this.visitService.getById(this.visitId).subscribe({
        next: (v) => this.visitForm.patchValue({
          visitorId: v.visitorId,
          hostId: v.hostId,
          purpose: v.purpose,
          notes: v.notes
        })
      });
    }
  }

  onSubmit(): void {
    if (this.visitForm.invalid) return;

    const request = this.visitForm.value;

    if (this.isEdit) {
      this.visitService.update(this.visitId, request).subscribe({
        next: () => {
          this.snackBar.open('Visit updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/visits']);
        }
      });
    } else {
      this.visitService.create(request).subscribe({
        next: () => {
          this.snackBar.open('Visit created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/visits']);
        }
      });
    }
  }
}
