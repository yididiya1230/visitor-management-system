import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgIf } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="login-header">
          <img src="assets/logo.svg" alt="ECX Logo" class="logo-img">
          <h1>Visitor Management System</h1>
          <p class="subtitle">Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input
              matInput
              formControlName="username"
              placeholder="Enter username"
            />
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input
              matInput
              type="password"
              formControlName="password"
              placeholder="Enter password"
            />
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            class="full-width login-btn"
            [disabled]="loginForm.invalid || loading"
          >
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <span *ngIf="!loading">Sign In</span>
          </button>
        </form>

        <p class="error-text" *ngIf="error">{{ error }}</p>

        <div class="login-footer">
          <p>{{ "Default: admin / Admin@123" }}</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a237e 0%, #0277bd 100%);
      }
      .login-card {
        width: 420px;
        padding: 40px;
        border-radius: 16px !important;
      }
      .login-header {
        text-align: center;
        margin-bottom: 32px;
      }
      .logo-img {
        width: 100px;
        height: auto;
        display: block;
        margin: 0 auto 16px;
      }
      .login-header h1 {
        font-size: 22px;
        font-weight: 700;
        color: #1a237e;
        margin-bottom: 8px;
      }
      .subtitle {
        color: #666;
        font-size: 14px;
      }
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }
      .login-btn {
        height: 48px;
        font-size: 16px;
        margin-top: 8px;
      }
      .error-text {
        color: #c62828;
        text-align: center;
        margin-top: 16px;
        font-size: 13px;
      }
      .login-footer {
        text-align: center;
        margin-top: 24px;
        color: #999;
        font-size: 12px;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = "";

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.error = err.error?.detail || "Invalid username or password";
        this.loading = false;
      },
    });
  }
}
