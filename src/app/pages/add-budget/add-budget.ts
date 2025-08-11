import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-budget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-budget.html',
  styleUrls: ['./add-budget.scss']
})
export class AddBudgetComponent {
  category = '';
  month = '';
  amount = 0;
  message = '';
  loading = false;

  // Catégories suggérées
  suggestedCategories = [
    'Restaurant',
    'Transport',
    'Courses',
    'Loisirs',
    'Vêtements',
    'Santé',
    'Logement',
    'Énergie',
    'Téléphone',
    'Sport'
  ];

  constructor(private http: HttpClient, private router: Router) {
    // Mois actuel par défaut
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    this.month = `${year}-${month}`;
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

  selectCategory(category: string) {
    this.category = category;
  }

  onSubmit() {
    if (!this.category.trim() || !this.month || !this.amount) {
      this.message = 'Tous les champs sont requis';
      return;
    }

    if (this.amount <= 0) {
      this.message = 'Le montant doit être supérieur à 0';
      return;
    }

    this.loading = true;
    this.message = '';

    const budgetData = {
      category: this.category.trim(),
      month: this.month,
      amount: +this.amount
    };

    this.http.post('http://localhost:3000/api/budgets', budgetData, this.getHeaders()).subscribe({
      next: (response: any) => {
        this.message = `Budget "${response.category}" de ${response.amount}€ créé pour ${response.month} !`;
        
        // Redirection vers le dashboard après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error?.includes('UNIQUE constraint failed')) {
          this.message = `Un budget pour "${this.category}" existe déjà pour ${this.month}`;
        } else {
          this.message = 'Erreur lors de la création du budget';
        }
        console.error(err);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
