import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-transaction.html',
  styleUrls: ['./add-transaction.scss']
})
export class AddTransactionComponent implements OnInit {
  accounts: any[] = [];
  account_id = '';
  type = 'expense';
  amount = 0;
  category = '';
  note = '';
  date = '';
  message = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    // Date d'aujourd'hui par défaut
    const today = new Date();
    this.date = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    // Vérifier si un type est passé en paramètre URL (actions rapides)
    this.route.queryParams.subscribe(params => {
      if (params['type'] && ['income', 'expense'].includes(params['type'])) {
        this.type = params['type'];
      }
    });
    
    this.loadAccounts();
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

  loadAccounts() {
    this.http.get('http://localhost:3000/api/accounts', this.getHeaders()).subscribe({
      next: (accounts: any) => {
        this.accounts = accounts;
        if (accounts.length > 0) {
          this.account_id = accounts[0].id.toString();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
        this.message = 'Erreur lors du chargement des comptes';
      }
    });
  }

  onSubmit() {
    if (!this.account_id || !this.amount || !this.category.trim() || !this.date) {
      this.message = 'Tous les champs sont requis';
      return;
    }

    this.loading = true;
    this.message = '';

    const transactionData = {
      account_id: parseInt(this.account_id),
      type: this.type,
      amount: +this.amount,
      category: this.category.trim(),
      note: this.note.trim() || null,
      date: this.date
    };

    this.http.post('http://localhost:3000/api/transactions', transactionData, this.getHeaders()).subscribe({
      next: (response: any) => {
        const typeText = this.type === 'income' ? 'Revenu' : 'Dépense';
        this.message = `${typeText} de ${response.amount}€ ajoutée avec succès !`;
        
        // Redirection vers le dashboard après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.message = 'Erreur lors de la création de la transaction';
        console.error(err);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
