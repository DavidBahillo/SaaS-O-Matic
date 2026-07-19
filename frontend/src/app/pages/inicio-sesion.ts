import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { Saas } from '../saas';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-inicio-sesion',
  imports: [CommonModule],
  template: `
    <main class="min-h-screen bg-background text-on-surface flex items-center justify-center p-4">
      <div class="w-full max-w-100 bg-surface-container border border-outline-variant rounded-lg p-8 shadow-2xl shadow-black/50">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
            SaaS-O-Matic
          </h1>
          <h2 class="text-sm font-body text-on-surface-variant">
            Inicia sesion en tu cuenta
          </h2>
        </div>

        @if (errorMessage()) {
          <div class="mb-5 rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-error font-body">
            {{ errorMessage() }}
          </div>
        }

        <form (submit)="submitLogin($event)" class="space-y-5">
          <div class="space-y-1.5">
            <label for="email" class="block text-sm font-label font-medium text-on-surface-variant">
              Correo Electronico
            </label>
            <input
              id="email"
              type="email"
              [value]="email()"
              (input)="email.set($any($event.target).value)"
              required
              class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-on-surface-variant/40"
              placeholder="tu@email.com"
            />
          </div>

          <div class="space-y-1.5">
            <label for="password" class="block text-sm font-label font-medium text-on-surface-variant">
              Contrasena
            </label>
            <div class="relative">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                [value]="password()"
                (input)="password.set($any($event.target).value)"
                required
                class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded pl-3 pr-10 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-on-surface-variant/40"
                placeholder="••••••••"
              />
              <button
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
                aria-label="Mostrar contrasena"
              >
                <span class="material-symbols-outlined text-[20px]">
                  {{ showPassword() ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </div>

          <p class="text-xs text-on-surface-variant text-center pt-2 leading-relaxed">
            Si has olvidado tus datos de acceso ponte en contacto con el administrador
          </p>

          <div class="pt-4">
            <button
              type="submit"
              [disabled]="submitting()"
              class="w-full bg-primary text-on-primary font-label font-semibold rounded-lg py-2.5 hover:bg-primary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface-container flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              @if (submitting()) {
                <span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Accediendo...
              } @else {
                Iniciar Sesion
                <span class="material-symbols-outlined text-[18px]">login</span>
              }
            </button>
          </div>
        </form>
      </div>
    </main>
  `,
})
export class InicioSesion {
  saas = inject(Saas);

  email = signal('');
  password = signal('');
  showPassword = signal(false);
  submitting = signal(false);
  errorMessage = signal('');

  async submitLogin(event: Event): Promise<void> {
    event.preventDefault();

    this.errorMessage.set('');
    this.submitting.set(true);

    try {
      await this.saas.login(this.email(), this.password());
      this.password.set('');
    } catch (error) {
      let message = 'No fue posible iniciar sesion.';

      if (error instanceof HttpErrorResponse) {
        const apiMessage =
          typeof error.error?.message === 'string' ? error.error.message : undefined;
        message = apiMessage ?? error.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      this.errorMessage.set(message);
    } finally {
      this.submitting.set(false);
    }
  }
}
