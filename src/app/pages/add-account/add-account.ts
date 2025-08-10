import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-account.html',
  styleUrls: ['./add-account.scss']
})
export class AddAccountComponent {
  name = '';
  type = 'checking';
  balance = 0;
  message = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  private getHeaders() {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  onSubmit() {
    if (!this.name.trim()) {
      this.message = 'Le nom du compte est requis';
      return;
    }

    this.loading = true;
    this.message = '';

    const accountData = {
      name: this.name.trim(),
      type: this.type,
      balance: parseFloat(this.balance.toString()) || 0
    };

    this.http.post('http://localhost:3000/api/accounts', accountData, this.getHeaders()).subscribe({
      next: (response: any) => {
        this.message = `Compte "${response.name}" créé avec succès !`;
        
        // Redirection vers le dashboard après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.message = 'Erreur lors de la création du compte';
        console.error(err);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
