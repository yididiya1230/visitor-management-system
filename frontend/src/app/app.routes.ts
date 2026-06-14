import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'visitors',
        loadComponent: () => import('./features/visitors/visitors-list/visitors-list.component').then(m => m.VisitorsListComponent)
      },
      {
        path: 'visitors/new',
        loadComponent: () => import('./features/visitors/visitor-form/visitor-form.component').then(m => m.VisitorFormComponent),
        canActivate: [roleGuard(['Admin', 'Receptionist'])]
      },
      {
        path: 'visitors/:id/edit',
        loadComponent: () => import('./features/visitors/visitor-form/visitor-form.component').then(m => m.VisitorFormComponent),
        canActivate: [roleGuard(['Admin', 'Receptionist'])]
      },
      {
        path: 'visits',
        loadComponent: () => import('./features/visits/visits-list/visits-list.component').then(m => m.VisitsListComponent)
      },
      {
        path: 'visits/new',
        loadComponent: () => import('./features/visits/visit-form/visit-form.component').then(m => m.VisitFormComponent),
        canActivate: [roleGuard(['Admin', 'Receptionist'])]
      },
      {
        path: 'hosts',
        loadComponent: () => import('./features/hosts/hosts-list/hosts-list.component').then(m => m.HostsListComponent),
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'hosts/new',
        loadComponent: () => import('./features/hosts/host-form/host-form.component').then(m => m.HostFormComponent),
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'departments',
        loadComponent: () => import('./features/departments/departments-list/departments-list.component').then(m => m.DepartmentsListComponent),
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [roleGuard(['Admin'])]
      },
      { path: '**', redirectTo: '/dashboard' }
    ]
  }
];
