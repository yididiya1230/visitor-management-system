import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { NgIf } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <button mat-icon-button (click)="drawer.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="brand-text">ECX Visitor Management</span>
      <span class="toolbar-spacer"></span>
      <button mat-button [matMenuTriggerFor]="menu">
        <mat-icon>account_circle</mat-icon>
        {{ currentUser?.fullName }}
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>

    <mat-drawer-container class="app-container">
      <mat-drawer #drawer mode="side" opened class="app-sidenav">
        <div class="sidenav-header">
          <img
            src="assets/logo.svg"
            alt="ECX"
            class="sidenav-logo"
            (error)="handleLogoError($event)"
          />
          <span class="sidenav-title">ETHIOPIA COMMODITY<br/>EXCHANGE</span>
        </div>
        <mat-nav-list>
          <a
            mat-list-item
            routerLink="/dashboard"
            routerLinkActive="active-link"
          >
            <mat-icon>dashboard</mat-icon> Dashboard
          </a>
          <a
            mat-list-item
            routerLink="/visitors"
            routerLinkActive="active-link"
          >
            <mat-icon>people</mat-icon> Visitors
          </a>
          <a mat-list-item routerLink="/visits" routerLinkActive="active-link">
            <mat-icon>assignment</mat-icon> Visits
          </a>
          <a
            mat-list-item
            routerLink="/hosts"
            routerLinkActive="active-link"
            *ngIf="isAdmin"
          >
            <mat-icon>badge</mat-icon> Hosts
          </a>
          <a
            mat-list-item
            routerLink="/departments"
            routerLinkActive="active-link"
            *ngIf="isAdmin"
          >
            <mat-icon>business</mat-icon> Departments
          </a>
          <a
            mat-list-item
            routerLink="/reports"
            routerLinkActive="active-link"
            *ngIf="isAdmin"
          >
            <mat-icon>assessment</mat-icon> Reports
          </a>
        </mat-nav-list>
      </mat-drawer>

      <mat-drawer-content class="app-content">
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [
    `
      .app-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: #2e7d32;
        color: white;
        height: 64px;
      }
      .brand-text {
        font-weight: 600;
        font-size: 18px;
        margin-left: 12px;
      }
      .toolbar-spacer {
        flex: 1 1 auto;
      }
      .app-container {
        position: absolute;
        top: 64px;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .app-sidenav {
        width: 260px;
        background: #fafafa;
        border-right: 1px solid #e0e0e0;
      }
      .sidenav-header {
        display: flex;
        align-items: center;
        padding: 20px 16px;
        gap: 12px;
        border-bottom: 1px solid #e0e0e0;
      }
      .sidenav-logo {
        width: 56px;
        height: 56px;
        object-fit: contain;
      }
      .sidenav-title {
        font-size: 20px;
        font-weight: 700;
        color: #2e7d32;
      }
      .app-content {
        padding: 24px;
        background: #f5f7fa;
        min-height: calc(100vh - 64px);
      }
      mat-nav-list a {
        display: flex;
        align-items: center;
        gap: 12px;
        height: 48px;
        color: #444;
        font-weight: 500;
      }
      mat-nav-list a:hover {
        background: #e8f5e9;
      }
      .active-link {
        background: #e8f5e9 !important;
        color: #2e7d32 !important;
        border-right: 3px solid #ef6c00;
      }
    `,
  ],
})
export class MainLayoutComponent {
  currentUser: any;
  isAdmin = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.isAdmin = this.authService.hasRole("Admin");
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => (window.location.href = "/login"),
    });
  }

  handleLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = "none";
  }
}
