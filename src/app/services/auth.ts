import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface représentant la réponse du backend après login / register
export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name?: string;
  };
  token: string;
}

@Injectable({
  providedIn: 'root'   // le service sera disponible partout dans l’app
})
export class AuthService {
  // URL de ton API backend (le serveur Node écoute sur le port 3000)
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  /** Enregistrement d’un nouvel utilisateur */
  register(email: string, password: string, name?: string): Observable<AuthResponse> {
    const payload = { email, password, name };
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
  }

  /** Connexion d’un utilisateur existant */
  login(email: string, password: string): Observable<AuthResponse> {
    const payload = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload);
  }

  /** Récupérer les informations de l’utilisateur connecté (requiert le JWT) */
  me(): Observable<{ user: { id: number; email: string; name?: string } }> {
    return this.http.get<{ user: { id: number; email: string; name?: string } }>(`${this.apiUrl}/me`);
  }
}