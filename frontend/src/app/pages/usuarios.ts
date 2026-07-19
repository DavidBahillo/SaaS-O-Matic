import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUser, Saas } from '../saas';
import { ButtonPrimary } from '../components/buttons/button-primary';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-usuarios',
  imports: [CommonModule, ButtonPrimary],
  template: `
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative bg-background">
      <div class="max-w-7xl mx-auto relative z-10 space-y-6">
        <section class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 class="text-3xl font-headline font-bold tracking-tight text-on-surface mb-2">Usuarios</h2>
            <p class="text-on-surface-variant font-body text-sm">
              Lista de usuarios registrados.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <div class="relative w-full md:w-80">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                [value]="searchQuery()"
                (input)="searchQuery.set($any($event.target).value)"
                class="w-full bg-surface-container border border-outline-variant rounded-lg py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Buscar por nombre o email..."
              />
            </div>

           
              
              <app-button-primary
                  [label]="' Nuevo Usuario'"
                  [icon]="'person_add'"
                  [fullWidth]="true"
                  [iconClass]="'text-[18px]'"
                  [labelClass]="'text-sm font-semibold'"
                  (pressed)="openCreateUserModal()"
                />
           
          </div>
        </section>

        <section class="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
          <div class="overflow-x-auto w-full pb-2">
            <table class="w-full text-left text-sm text-on-surface whitespace-nowrap">
              <thead class="text-xs text-on-surface-variant bg-surface-container-highest border-b border-outline-variant uppercase font-body font-semibold">
                <tr>
                  <th class="px-6 py-4 tracking-wider" scope="col">Nombre</th>
                  <th class="px-6 py-4 tracking-wider" scope="col">Email</th>
                  <th class="px-6 py-4 tracking-wider" scope="col">Rol</th>
                  <th class="px-6 py-4 tracking-wider" scope="col">Alta</th>
                  
                    <th class="px-6 py-4 tracking-wider text-right" scope="col">Acciones</th>
                  
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant font-body">
                @for (user of filteredUsers(); track user.id ) {
                  <tr class="hover:bg-surface-container-high transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-xs font-bold">
                          {{ getInitials(user.nombre, user.apellido) }}
                        </div>
                        <span class="font-medium text-on-surface">{{ user.nombre }} {{ user.apellido }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-on-surface-variant">{{ user.email }}</td>
                    <td class="px-6 py-4">
                      <span
                        [class]="
                          user.rol === 'admin'
                            ? 'inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-xs font-semibold text-primary'
                            : 'inline-flex items-center rounded-full bg-surface-container-highest border border-outline-variant px-2.5 py-0.5 text-xs font-semibold text-on-surface-variant'
                        "
                      >
                        {{ user.rol === 'admin' ? 'Administrador' : 'Usuario' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-on-surface-variant">{{ formatDate(user.createdAt) }}</td>
                    
                      <td class="px-6 py-4">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="openEditUserModal(user)"
                            class="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-lowest transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <span class="material-symbols-outlined text-[18px]"
                              >check</span
                            >
                          </button>
                          @if (!isCurrentUser(user.id)) {
                          <button
                            (click)="deleteUser(user)"
                            class="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-surface-container-lowest transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <span class="material-symbols-outlined text-[18px]"
                              >delete</span
                            >
                          </button>
                          }
                        </div>
                        

                         
                      </td>
                    
                  </tr>
                } @empty {
                  <tr>
                    <td [attr.colspan]="saas.currentUserIsAdmin() ? 5 : 4" class="px-6 py-10 text-center text-on-surface-variant">
                      No hay usuarios que coincidan con la busqueda.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>

      @if (pendingDeleteUser(); as userToDelete) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
        >
          <div
            (click)="cancelDeleteUser()"
            (keydown.escape)="cancelDeleteUser()"
            role="button"
            tabindex="0"
            class="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
          ></div>

          <div
            class="relative w-full max-w-md bg-surface border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div class="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
              <h3 class="text-xl font-bold tracking-tight text-on-surface">Confirmar borrado</h3>
              <button
                type="button"
                (click)="cancelDeleteUser()"
                class="p-1 hover:bg-surface-container-high rounded transition-all text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="p-6 space-y-5 font-body">
              <div class="flex items-start gap-3 rounded-lg border border-error/30 bg-error/10 p-3">
                <span class="material-symbols-outlined text-error mt-0.5">warning</span>
                <p class="text-sm text-on-surface">
                  Vas a borrar a <span class="font-semibold">{{ userToDelete.nombre }} {{ userToDelete.apellido }}</span>.
                  Esta accion no se puede deshacer.
                </p>
              </div>

              <div class="pt-2 border-t border-outline-variant flex justify-end items-center gap-3">
                <button
                  type="button"
                  (click)="cancelDeleteUser()"
                  class="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  (click)="confirmDeleteUser()"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-error text-on-error rounded-lg text-sm font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[14px]">delete</span>
                  Borrar usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </main>
  `,
})
export class Usuarios {
  saas = inject(Saas);

  searchQuery = signal('');
  pendingDeleteUser = signal<AppUser | null>(null);

  filteredUsers = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.saas.users();
    }

    return this.saas.users().filter((user) => {
      const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
      return fullName.includes(query) || user.email.toLowerCase().includes(query);
    });
  });

  openCreateUserModal(): void {
    this.saas.activeEditUser.set(null);
    this.saas.showAddUserModal.set(true);
  }

  openEditUserModal(user: AppUser): void {
    this.saas.activeEditUser.set(user);
    this.saas.showAddUserModal.set(true);
  }

  isCurrentUser(userId: number): boolean {
    return this.saas.currentUserId() === userId;
  }

  async deleteUser(user: AppUser): Promise<void> {
    this.pendingDeleteUser.set(user);
  }

  cancelDeleteUser(): void {
    this.pendingDeleteUser.set(null);
  }

  async confirmDeleteUser(): Promise<void> {
    const user = this.pendingDeleteUser();
    if (!user) {
      return;
    }

    try {
      await this.saas.deleteUserById(user.id);
      this.pendingDeleteUser.set(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo borrar el usuario.';
      window.alert(message);
    }
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }

  getInitials(nombre: string, apellido: string): string {
    const first = nombre?.trim().charAt(0).toUpperCase() ?? '';
    const second = apellido?.trim().charAt(0).toUpperCase() ?? '';
    return `${first}${second}`;
  }
}
