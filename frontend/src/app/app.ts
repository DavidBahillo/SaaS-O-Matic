import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Saas, Customer, Tax, UserRole} from './saas';
import {Dashboard} from './pages/dashboard';
import {Clientes} from './pages/clientes';
import {Usuarios} from './pages/usuarios';
import {DetalleCliente} from './pages/detalle-cliente';
import {Presupuesto} from './pages/presupuesto';
import {Analiticas} from './pages/analiticas';
import {Ajustes} from './pages/ajustes';
import {InicioSesion} from './pages/inicio-sesion';
import {SidebarMenu} from './components/layout/sidebar-menu';
import {TopMenu} from './components/layout/top-menu';
import {MobileBottomMenu} from './components/layout/mobile-bottom-menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    CommonModule,
    Dashboard,
    Clientes,
    Usuarios,
    DetalleCliente,
    Presupuesto,
    Analiticas,
    Ajustes,
    InicioSesion,
    SidebarMenu,
    TopMenu,
    MobileBottomMenu,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  saas = inject(Saas);

  constructor() {
    effect(() => {
      const client = this.saas.activeEditClient();
      const isOpen = this.saas.showEditClientModal();

      if (!client || !isOpen) {
        return;
      }

      this.editClientName.set(client.name);
      this.editClientCif.set(client.cif === 'N/A' ? '' : client.cif);
      this.editClientCountryCode.set(client.countryCode);
      this.editClientEmail.set(client.email);
      this.editClientPlan.set(client.plan);
    });

    effect(() => {
      const activeUser = this.saas.activeEditUser();
      const isOpen = this.saas.showAddUserModal();

      if (!isOpen) {
        return;
      }

      if (activeUser) {
        this.newUserNombre.set(activeUser.nombre);
        this.newUserApellido.set(activeUser.apellido);
        this.newUserEmail.set(activeUser.email);
        this.newUserRol.set(activeUser.rol);
        this.newUserContrasena.set('');
        this.addUserError.set('');
        return;
      }

      this.resetUserForm();
    });
  }

  // Form states for adding customer
  newClientName = signal('');
  newClientCif = signal('');
  newClientCountryCode = signal('es');
  newClientEmail = signal('');
  newClientPlan = signal<'Plan Starter' | 'Plan Pro' | 'Plan Enterprise'>('Plan Starter');
  addClientError = signal('');

  // Form states for editing customer
  editClientName = signal('');
  editClientCif = signal('');
  editClientCountryCode = signal('es');
  editClientEmail = signal('');
  editClientPlan = signal<'Plan Starter' | 'Plan Pro' | 'Plan Enterprise'>('Plan Starter');

  // Form states for adding tax
  newTaxCountry = signal('España');
  newTaxCountryCode = signal('es');
  newTaxName = signal('IVA');
  newTaxPercentage = signal(21);

  // Form states for adding users
  newUserNombre = signal('');
  newUserApellido = signal('');
  newUserEmail = signal('');
  newUserContrasena = signal('');
  newUserRol = signal<UserRole>('usuario');
  addUserError = signal('');

  // Open Edit Customer prefilled
  openEditCustomer(client: Customer) {
    this.editClientName.set(client.name);
    this.editClientCif.set(client.cif);
    this.editClientCountryCode.set(client.countryCode);
    this.editClientEmail.set(client.email);
    this.editClientPlan.set(client.plan);
    this.saas.activeEditClient.set(client);
    this.saas.showEditClientModal.set(true);
  }

  async submitAddClient(): Promise<void> {
    this.addClientError.set('');

    try {
      await this.saas.addClient({
        name: this.newClientName(),
        cif: this.newClientCif(),
        countryCode: this.newClientCountryCode(),
        email: this.newClientEmail(),
        plan: this.newClientPlan(),
      });

      // Reset fields
      this.newClientName.set('');
      this.newClientCif.set('');
      this.newClientCountryCode.set('es');
      this.newClientEmail.set('');
      this.newClientPlan.set('Plan Starter');
    } catch (error) {
      let message = 'No se pudo crear el cliente.';

      if (error instanceof HttpErrorResponse) {
        const apiMessage =
          typeof error.error?.message === 'string' ? error.error.message : undefined;
        message = apiMessage ?? error.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      this.addClientError.set(message);
    }
  }

  async submitEditClient(): Promise<void> {
    const active = this.saas.activeEditClient();
    if (!active) return;

    const normalizedCountryCode = this.editClientCountryCode().toLowerCase();
    const countryName = this.saas.getDisplayCountryName(normalizedCountryCode);

    const updated: Customer = {
      ...active,
      name: this.editClientName(),
      cif: this.editClientCif(),
      countryCode: normalizedCountryCode,
      country: countryName,
      email: this.editClientEmail(),
      plan: this.editClientPlan(),
    };

    try {
      await this.saas.updateClient(updated);
      this.saas.showEditClientModal.set(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el cliente.';
      window.alert(message);
    }
  }

  async submitAddTax(): Promise<void> {
    const code = this.newTaxCountryCode().toLowerCase();
    const option = this.saas
      .customerCountryOptions()
      .find((country) => country.countryCode.toLowerCase() === code);
    const countryName = option?.countryName ?? this.saas.getDisplayCountryName(code);

    const newTax: Tax = {
      country: countryName,
      countryCode: code,
      taxName: this.newTaxName(),
      percentage: this.newTaxPercentage(),
    };

    try {
      await this.saas.addTax(newTax);

      // Reset
      this.newTaxName.set('IVA');
      this.newTaxPercentage.set(21);
      this.newTaxCountryCode.set('es');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el impuesto.';
      window.alert(message);
    }
  }

  async submitUserForm(): Promise<void> {
    this.addUserError.set('');

    try {
      const activeUser = this.saas.activeEditUser();

      if (activeUser) {
        await this.saas.updateUser({
          id: activeUser.id,
          nombre: this.newUserNombre(),
          apellido: this.newUserApellido(),
          email: this.newUserEmail(),
          contrasena: this.newUserContrasena(),
          rol: this.newUserRol(),
        });
      } else {
        await this.saas.createUser({
          nombre: this.newUserNombre(),
          apellido: this.newUserApellido(),
          email: this.newUserEmail(),
          contrasena: this.newUserContrasena(),
          rol: this.newUserRol(),
        });
      }

      this.resetUserForm();
    } catch (error) {
      let message = 'No se pudo crear el usuario.';

      if (this.saas.activeEditUser()) {
        message = 'No se pudo actualizar el usuario.';
      }

      if (error instanceof HttpErrorResponse) {
        const apiMessage =
          typeof error.error?.message === 'string' ? error.error.message : undefined;
        message = apiMessage ?? error.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      this.addUserError.set(message);
    }
  }

  cancelAddClient() {
    this.addClientError.set('');
    this.saas.showAddClientModal.set(false);
  }

  cancelEditClient() {
    this.saas.showEditClientModal.set(false);
  }

  cancelAddTax() {
    this.saas.showAddTaxModal.set(false);
  }

  cancelAddUser() {
    this.saas.activeEditUser.set(null);
    this.resetUserForm();
    this.saas.showAddUserModal.set(false);
  }

  private resetUserForm(): void {
    this.newUserNombre.set('');
    this.newUserApellido.set('');
    this.newUserEmail.set('');
    this.newUserContrasena.set('');
    this.newUserRol.set('usuario');
    this.addUserError.set('');
  }
}
