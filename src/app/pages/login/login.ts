import { Component } from '@angular/core';
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

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        // Stocke le token pour les futures requêtes
        localStorage.setItem('jwtToken', res.token);
        this.message = `Bienvenue, ${res.user.name || res.user.email}!`;
      },
      error: (err) => {
        this.message = 'Échec de la connexion';
        console.error(err);
      }
    });
  }
}