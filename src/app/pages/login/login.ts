import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        // Stocke le token pour les futures requêtes
        localStorage.setItem('jwtToken', res.token);
        this.message = `Bienvenue, ${res.user.name || res.user.email}!`;
        
        // Redirection automatique vers le dashboard après 1 seconde
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (err) => {
        this.message = 'Échec de la connexion';
        console.error(err);
      }
    });
  }
}