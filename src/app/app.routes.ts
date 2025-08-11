import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AddAccountComponent } from './pages/add-account/add-account';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction';
import { AddBudgetComponent } from './pages/add-budget/add-budget';
import { ReportsComponent } from './pages/reports/reports';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-account', component: AddAccountComponent },
  { path: 'add-transaction', component: AddTransactionComponent },
  { path: 'add-budget', component: AddBudgetComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: 'dashboard' }
];