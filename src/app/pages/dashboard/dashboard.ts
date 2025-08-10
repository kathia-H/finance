import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  accounts: any[] = [];
  transactions: any[] = [];
  budgets: any[] = [];
  totalBalance = 0;
  loading = true;
  
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadUserData();
  }

  private getHeaders() {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  loadUserData() {
    this.loading = true;
    
    // Charger les informations utilisateur
    this.http.get('http://localhost:3000/api/auth/me', this.getHeaders()).subscribe({
      next: (user: any) => {
        this.user = user;
        this.loadAccounts();
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
        this.loading = false;
      }
    });
  }

  loadAccounts() {
    this.http.get('http://localhost:3000/api/accounts', this.getHeaders()).subscribe({
      next: (accounts: any) => {
        this.accounts = accounts;
        this.totalBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
        this.loadTransactions();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
        this.loading = false;
      }
    });
  }

  loadTransactions() {
    this.http.get('http://localhost:3000/api/transactions', this.getHeaders()).subscribe({
      next: (transactions: any) => {
        // Prendre seulement les 5 dernières transactions
        this.transactions = transactions.slice(0, 5);
        this.loadBudgets();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions:', err);
        this.loading = false;
      }
    });
  }

  loadBudgets() {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: 2025-01
    this.http.get(`http://localhost:3000/api/budgets/month/${currentMonth}`, this.getHeaders()).subscribe({
      next: (budgets: any) => {
        this.budgets = budgets;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des budgets:', err);
        this.loading = false;
      }
    });
  }

  // TrackBy functions for Angular performance
  trackAccountById(index: number, account: any): number {
    return account.id;
  }

  trackTransactionById(index: number, transaction: any): number {
    return transaction.id;
  }

  trackBudgetById(index: number, budget: any): number {
    return budget.id;
  }

  // Navigation methods
  goToAddAccount() {
    this.router.navigate(['/add-account']);
  }

  goToAddTransaction() {
    this.router.navigate(['/add-transaction']);
  }

}