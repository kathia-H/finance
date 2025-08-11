import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportsComponent implements OnInit {
  user: any = null;
  accounts: any[] = [];
  transactions: any[] = [];
  budgets: any[] = [];
  loading = true;
  currentDate: string = '';

  // Statistiques calculées
  totalBalance = 0;
  monthlyIncome = 0;
  monthlyExpenses = 0;
  monthlyNet = 0;
  
  // Données pour les graphiques
  expensesByCategory: any[] = [];
  incomesByCategory: any[] = [];
  monthlyTrend: any[] = [];
  budgetAnalysis: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.currentDate = new Date().toLocaleDateString('fr-FR');
  }

  ngOnInit() {
    this.loadReportsData();
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

  loadReportsData() {
    this.loading = true;
    
    // Charger toutes les données nécessaires
    Promise.all([
      this.http.get('http://localhost:3000/api/auth/me', this.getHeaders()).toPromise(),
      this.http.get('http://localhost:3000/api/accounts', this.getHeaders()).toPromise(),
      this.http.get('http://localhost:3000/api/transactions', this.getHeaders()).toPromise(),
      this.http.get(`http://localhost:3000/api/budgets/month/${this.getCurrentMonth()}`, this.getHeaders()).toPromise()
    ]).then(([user, accounts, transactions, budgets]) => {
      this.user = user;
      this.accounts = accounts as any[];
      this.transactions = transactions as any[];
      this.budgets = budgets as any[];
      
      this.calculateStatistics();
      this.loading = false;
    }).catch(err => {
      console.error('Erreur lors du chargement des rapports:', err);
      this.loading = false;
    });
  }

  getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  calculateStatistics() {
    // Solde total
    this.totalBalance = this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    // Transactions du mois actuel
    const currentMonth = this.getCurrentMonth();
    const currentMonthTransactions = this.transactions.filter(t => 
      t.date.startsWith(currentMonth)
    );
    
    // Revenus et dépenses du mois
    this.monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    this.monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    this.monthlyNet = this.monthlyIncome - this.monthlyExpenses;
    
    // Dépenses par catégorie
    this.calculateExpensesByCategory(currentMonthTransactions);
    
    // Revenus par catégorie
    this.calculateIncomesByCategory(currentMonthTransactions);
    
    // Analyse des budgets
    this.calculateBudgetAnalysis();
    
    // Tendance mensuelle (3 derniers mois)
    this.calculateMonthlyTrend();
  }

  calculateExpensesByCategory(transactions: any[]) {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: { [key: string]: number } = {};
    
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    this.expensesByCategory = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  calculateIncomesByCategory(transactions: any[]) {
    const incomes = transactions.filter(t => t.type === 'income');
    const categoryTotals: { [key: string]: number } = {};
    
    incomes.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    this.incomesByCategory = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  calculateBudgetAnalysis() {
    this.budgetAnalysis = this.budgets.map(budget => ({
      ...budget,
      status: budget.percentage > 100 ? 'Dépassé' : 
              budget.percentage > 80 ? 'Attention' : 'OK',
      statusColor: budget.percentage > 100 ? '#dc3545' : 
                   budget.percentage > 80 ? '#ffc107' : '#28a745'
    }));
  }

  calculateMonthlyTrend() {
    const months = [];
    const now = new Date();
    
    // Générer les 3 derniers mois
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      const monthTransactions = this.transactions.filter(t => t.date.startsWith(monthKey));
      const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: monthName,
        income,
        expenses,
        net: income - expenses
      });
    }
    
    this.monthlyTrend = months;
  }

  getExpensePercentage(amount: number): number {
    return this.monthlyExpenses > 0 ? (amount / this.monthlyExpenses) * 100 : 0;
  }

  getIncomePercentage(amount: number): number {
    return this.monthlyIncome > 0 ? (amount / this.monthlyIncome) * 100 : 0;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
