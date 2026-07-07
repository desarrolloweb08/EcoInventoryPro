import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class Login {

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    if (!this.username || !this.password) {
      this.errorMessage = 'Complete todos los campos';
      this.mostrarError();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.ocultarError();

    this.authService.login(this.username, this.password).subscribe({

      next: (response: any) => {

        this.loading = false;

        console.log('Respuesta Backend:', response);

        if (response.success && response.data) {

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('usuario', JSON.stringify(response.data));

          this.router.navigate(['/dashboard']);

        } else {

          this.errorMessage = response.message || 'Credenciales incorrectas';
          this.mostrarError();

        }

      },

      error: (err: any) => {

        this.loading = false;

        console.error('Error Login:', err);

        this.errorMessage =
          err.error?.message ||
          'Error al conectar con el servidor';

        this.mostrarError();

      }

    });

  }

  mostrarError(): void {
    const el = document.getElementById('errorMessage');
    if (el) {
      el.textContent = this.errorMessage;
      el.classList.add('show');
    }
  }

  ocultarError(): void {
    const el = document.getElementById('errorMessage');
    if (el) {
      el.classList.remove('show');
    }
  }

}