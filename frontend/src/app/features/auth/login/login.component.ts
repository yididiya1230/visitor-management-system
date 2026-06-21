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
      <div class="login-card-wrapper">
        <div class="brand-section">
          <div class="brand-content">
            <img src="assets/logo.svg" alt="ECX Logo" class="logo-img">
            <h2>Visitor Management System</h2>
            <p class="brand-desc">Secure, streamlined visitor tracking and management for ECX facilities.</p>
            <div class="brand-features">
              <div class="feature">
                <mat-icon>verified_user</mat-icon>
                <span>Role-based access control</span>
              </div>
              <div class="feature">
                <mat-icon>qr_code_scanner</mat-icon>
                <span>Digital check-in / check-out</span>
              </div>
              <div class="feature">
                <mat-icon>assessment</mat-icon>
                <span>Real-time reports & analytics</span>
              </div>
            </div>
          </div>
        </div>

        <mat-card class="login-card">
          <div class="login-header">
            <h1>Welcome Back</h1>
            <p class="subtitle">Sign in to your account</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="Enter username" />
              <mat-icon matPrefix>person_outline</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Enter password" />
              <mat-icon matPrefix>lock_outline</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" class="full-width login-btn" [disabled]="loginForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>

          <p class="error-text" *ngIf="error">{{ error }}</p>

          <div class="login-footer">
            <p>Demo: <strong>admin</strong> / <strong>Admin&#64;123</strong></p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
        padding: 20px;
      }
      .login-card-wrapper {
        display: flex;
        max-width: 900px;
        width: 100%;
        min-height: 560px;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(26, 35, 126, 0.12);
      }
      .brand-section {
        flex: 1;
        background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #0277bd 100%);
        padding: 48px 40px;
        display: flex;
        align-items: center;
        color: white;
      }
      .brand-content {
        max-width: 320px;
      }
      .logo-img {
        height: 48px;
        width: auto;
        margin-bottom: 32px;
      }
      .brand-content h2 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 12px;
        line-height: 1.3;
      }
      .brand-desc {
        font-size: 14px;
        opacity: 0.8;
        line-height: 1.6;
        margin-bottom: 36px;
      }
      .brand-features {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .feature {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        opacity: 0.9;
      }
      .feature mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        opacity: 0.9;
      }
      .login-card {
        width: 420px;
        padding: 48px 40px;
        border-radius: 0 !important;
        box-shadow: none !important;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .login-header {
        margin-bottom: 32px;
      }
      .login-header h1 {
        font-size: 26px;
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
        margin-bottom: 20px;
      }
      .login-btn {
        height: 48px;
        font-size: 15px;
        font-weight: 600;
        margin-top: 4px;
        border-radius: 8px;
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
        font-size: 13px;
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
