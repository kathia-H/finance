import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.register(this.email, this.password, this.name).subscribe({
      next: (res) => {
        localStorage.setItem('jwtToken', res.token);
        this.message = `Compte créé ! Bienvenue, ${res.user.name || res.user.email}!`;
      },
      error: (err) => {
        this.message = 'Erreur lors de la création du compte';
        console.error(err);
      }
    });
  }
}