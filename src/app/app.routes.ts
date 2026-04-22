import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'work',
    loadComponent: () => import('./pages/work/work.component').then((m) => m.WorkComponent),
    title: 'Work',
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then((m) => m.ProjectsComponent),
    title: 'Projects',
  },
  {
    path: 'lab',
    loadComponent: () => import('./pages/lab/lab.component').then((m) => m.LabComponent),
    title: 'Lab',
  },
  {
    path: 'uses',
    loadComponent: () => import('./pages/uses/uses.component').then((m) => m.UsesComponent),
    title: 'Uses',
  },
  {
    path: 'now',
    loadComponent: () => import('./pages/now/now.component').then((m) => m.NowComponent),
    title: 'Now',
  },
  {
    path: 'elsewhere',
    loadComponent: () => import('./pages/elsewhere/elsewhere.component').then((m) => m.ElsewhereComponent),
    title: 'Elsewhere',
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact',
  },
  {
    path: 'writing',
    redirectTo: 'elsewhere',
    pathMatch: 'full',
  },
  {
    path: 'about',
    redirectTo: 'work',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
