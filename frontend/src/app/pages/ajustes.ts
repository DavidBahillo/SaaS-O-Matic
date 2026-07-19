import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Saas, Tax } from "../saas";
import { ButtonDanger } from "../components/buttons/button-danger";
import { ButtonTertiary } from "../components/buttons/button-tertiary";
import { ButtonPrimary } from "../components/buttons/button-primary";
import { ButtonSecondary } from "../components/buttons/button-secondary";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-ajustes",
  imports: [
    CommonModule,
    ButtonDanger,
    ButtonTertiary,
    ButtonPrimary,
    ButtonSecondary,
  ],
  template: `
    <!-- Page Content -->
    <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-background">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div>
          <h2
            class="text-3xl font-headline font-bold text-on-surface tracking-tight"
          >
            Configuración General
          </h2>
          <p class="text-on-surface-variant text-sm mt-1 font-body">
            Administra tus datos, tramos de tarificación y gestión de impuestos
            a nivel global.
          </p>
        </div>

        <!-- Feedback Alerts -->
        @if (feedbackMessage()) {
          <div
            class="p-4 rounded-lg bg-tertiary-container/20 border border-tertiary/30 text-tertiary flex items-center gap-2 font-body text-sm animate-pulse"
          >
            <span class="material-symbols-outlined">check_circle</span>
            {{ feedbackMessage() }}
          </div>
        }

        <!-- Tab Navigation -->
        <div
          class="border-b border-outline-variant mb-6 overflow-x-auto no-scrollbar"
        >
          <nav class="flex gap-6 min-w-max">
            <button
              (click)="saas.currentSettingsTab.set('perfil')"
              [class]="
                activeTab() === 'perfil'
                  ? 'pb-4 text-sm font-medium text-primary border-b-2 border-primary transition-colors cursor-pointer'
                  : 'pb-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer'
              "
            >
              Perfil
            </button>
            <button
              (click)="saas.currentSettingsTab.set('precios')"
              [class]="
                activeTab() === 'precios'
                  ? 'pb-4 text-sm font-medium text-primary border-b-2 border-primary transition-colors cursor-pointer'
                  : 'pb-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer'
              "
            >
              Tramos de Precios
            </button>
            <button
              (click)="saas.currentSettingsTab.set('impuestos')"
              [class]="
                activeTab() === 'impuestos'
                  ? 'pb-4 text-sm font-medium text-primary border-b-2 border-primary transition-colors cursor-pointer'
                  : 'pb-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer'
              "
            >
              Gestión de Impuestos
            </button>
          </nav>
        </div>

        <!-- TAB CONTENT: Perfil -->
        @if (activeTab() === "perfil") {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Personal Info Card -->
            <div
              class="bg-surface-container-low rounded-xl border border-outline-variant p-6 lg:p-8"
            >
              <h3
                class="text-lg font-medium text-on-surface mb-6 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-primary text-[20px]"
                  >person</span
                >
                Información Personal
              </h3>
              <div class="space-y-5">
                <div class="space-y-1.5 font-body">
                  <label
                    class="text-sm font-medium text-on-surface-variant"
                    for="profile-name"
                    >Nombre</label
                  >
                  <input
                    id="profile-name"
                    type="text"
                    [value]="profileName()"
                    (input)="profileName.set($any($event.target).value)"
                    class="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
                <div class="space-y-1.5 font-body">
                  <label
                    class="text-sm font-medium text-on-surface-variant"
                    for="profile-surname"
                    >Apellidos</label
                  >
                  <input
                    id="profile-surname"
                    type="text"
                    [value]="profileSurname()"
                    (input)="profileSurname.set($any($event.target).value)"
                    class="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
                <div class="space-y-1.5 font-body">
                  <label
                    class="text-sm font-medium text-on-surface-variant"
                    for="profile-email"
                    >Correo Electrónico</label
                  >
                  <div class="relative">
                    <span
                      class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
                      >mail</span
                    >
                    <input
                      id="profile-email"
                      type="email"
                      [value]="profileEmail()"
                      (input)="profileEmail.set($any($event.target).value)"
                      class="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>
                <div class="flex justify-end mt-2">
                  <app-button-primary
                    (pressed)="saveProfile()"
                    [label]="'Guardar Cambios'"
                    [icon]="'save'"
                    [iconClass]="'text-[18px]'"
                    [labelClass]="'text-sm font-medium'"
                  />
                </div>
              </div>
            </div>

            <!-- Security Card -->
            <div
              class="bg-surface-container-low rounded-xl border border-outline-variant p-6 lg:p-8"
            >
              <h3
                class="text-lg font-medium text-on-surface mb-6 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-primary text-[20px]"
                  >lock</span
                >
                Seguridad
              </h3>
              <div class="space-y-5">
                <div class="space-y-1.5 font-body">
                  <label
                    class="text-sm font-medium text-on-surface-variant"
                    for="curr-pwd"
                    >Contraseña Actual</label
                  >
                  <div class="relative">
                    <span
                      class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
                      >key</span
                    >
                    <input
                      id="curr-pwd"
                      type="password"
                      [value]="currentPassword()"
                      (input)="currentPassword.set($any($event.target).value)"
                      placeholder="••••••••"
                      class="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>
                <div class="space-y-1.5 font-body">
                  <label
                    class="text-sm font-medium text-on-surface-variant"
                    for="new-pwd"
                    >Nueva Contraseña</label
                  >
                  <div class="relative">
                    <span
                      class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
                      >lock_reset</span
                    >
                    <input
                      id="new-pwd"
                      type="password"
                      [value]="newPassword()"
                      (input)="newPassword.set($any($event.target).value)"
                      placeholder="Ingresa nueva contraseña"
                      class="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <p class="text-xs text-on-surface-variant mt-1">
                    Mínimo 8 caracteres, incluye letras y números.
                  </p>
                </div>
                <div class="pt-2">
                  <app-button-secondary
                    (pressed)="updateCredentials()"
                    [label]="'Actualizar Contraseña'"
                    [borderColorClass]="true"
                  >
                  </app-button-secondary>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="bg-background rounded-xl border border-error/30 p-6 mt-6">
            <h3
              class="text-lg font-medium text-error mb-2 flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-[20px]">warning</span>
              Zona de Peligro
            </h3>
            <p class="text-sm text-on-surface-variant mb-4 font-body">
              Eliminar tu cuenta es una acción permanente y no se puede
              deshacer. Todos tus datos se perderán.
            </p>
            <app-button-danger
              (pressed)="deleteAccount()"
              [label]="'Eliminar Cuenta'"
              [fullWidth]="false"
              [icon]="'delete'"
              [iconClass]="'text-[18px]'"
              [labelClass]="'text-sm font-semibold'"
            />
          </div>
        }

        <!-- TAB CONTENT: Tramos de Precios -->
        @if (activeTab() === "precios") {
          <div
            class="bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-2xl"
          >
            <!-- Table Header -->
            <div
              class="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 border-b border-outline-variant bg-surface-container-high/40 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest"
            >
              <div class="col-span-1">Nivel</div>
              <div class="col-span-5">Límite de Usuarios</div>
              <div class="col-span-5 font-headline">Precio por Usuario</div>
              <div class="col-span-1 text-right">Acción</div>
            </div>

            <!-- Tiers List -->
            <div class="flex flex-col font-body">
              @for (tier of saas.tiers(); track tier.id; let isLast = $last) {
                <div
                  class="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-5 items-start md:items-center border-b border-outline-variant/30 hover:bg-surface-container-high/20 transition-colors group relative"
                >
                  <!-- Highlight infinite tier -->
                  @if (tier.limit === null) {
                    <div
                      class="absolute left-0 top-0 bottom-0 w-1 bg-primary/20"
                    ></div>
                  }

                  <div class="col-span-1 flex items-center gap-2">
                    <span
                      class="text-[11px] uppercase tracking-wider text-on-surface-variant md:hidden"
                      >Nivel</span
                    >
                    <span
                      class="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container-highest text-xs font-mono text-on-surface font-semibold border border-outline-variant"
                      >{{ tier.level }}</span
                    >
                  </div>

                  <div
                    class="col-span-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-3"
                  >
                    <span
                      class="text-[11px] uppercase tracking-wider text-on-surface-variant md:hidden"
                      >Límite de usuarios</span
                    >
                    @if (tier.limit !== null) {
                      <span class="text-sm text-on-surface-variant">Hasta</span>
                      <div class="relative w-full md:flex-1 md:max-w-30">
                        <input
                          type="number"
                          [value]="tier.limit"
                          (input)="
                            updateTierLimit(tier.id, +$any($event.target).value)
                          "
                          class="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-1.5 px-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                        />
                      </div>
                      <span class="text-sm text-on-surface-variant"
                        >usuarios</span
                      >
                    } @else {
                      <span
                        class="text-sm text-on-surface-variant italic font-medium"
                        >+ de {{ getPreviousLimit(tier.level) }} usuarios</span
                      >
                    }
                  </div>

                  <div
                    class="col-span-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-3"
                  >
                    <span
                      class="text-[11px] uppercase tracking-wider text-on-surface-variant md:hidden"
                      >Precio por usuario</span
                    >
                    <span class="text-sm text-on-surface-variant">Precio:</span>
                    <div class="relative w-full md:flex-1 md:max-w-30">
                      <input
                        type="number"
                        [value]="tier.price"
                        (input)="
                          updateTierPrice(tier.id, +$any($event.target).value)
                        "
                        class="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-1.5 px-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                      />
                    </div>
                    <span class="text-sm text-on-surface-variant"
                      >€ / usuario</span
                    >
                  </div>
                    
                  <div
                    class="col-span-1 flex justify-start md:justify-end pt-1 md:pt-0"
                  >
                  @if (saas.currentUserIsAdmin()) {
                    <button
                      (click)="deleteTierLine(tier.id)"
                      [disabled]="tier.limit === null"
                      class="p-2 rounded-md text-on-surface-variant/30 hover:text-error hover:bg-error/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-[18px]"
                        >delete</span
                      >
                    </button>
                  }
                  </div>
                </div>
              }
            </div>

            <!-- Add Tier Action Area -->
            <div
              class="p-5 border-t border-outline-variant bg-surface-container-lowest flex justify-center"
            > @if (saas.currentUserIsAdmin()) {
              <app-button-tertiary
                (pressed)="addNewTier()"
                [label]="'Añadir nuevo tramo'"
                [icon]="'add'"
                [iconClass]="'text-[18px]'"
                [labelClass]="'text-sm font-semibold'"
              />
            }@else {
              <p class="text-sm text-on-surface-variant">La edición de tramos solo esta disponible para administradores</p>
            }
            </div>
          </div>

          <!-- Sticky Bottom Action Bar -->
          <div class="pt-6 flex justify-stretch md:justify-end">
            @if (saas.currentUserIsAdmin()) {
            <app-button-primary
              (pressed)="saveTiersConfig()"
              [label]="'Guardar Configuración'"
              [icon]="'save'"
              [iconClass]="'text-[18px]'"
              [labelClass]="'text-sm font-bold'"
            />
            }
          </div>
        }

        <!-- TAB CONTENT: Gestión de Impuestos -->
        @if (activeTab() === "impuestos") {
          <div
            class="bg-surface-container rounded-lg border border-outline-variant overflow-hidden shadow-sm flex flex-col"
          >
            <!-- Table Toolbar -->
            <div
              class="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-high"
            >
              <div class="relative w-full sm:w-72 rounded-md font-body">
                <span
                  class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
                  >search</span
                >
                <input
                  type="text"
                  [value]="saas.taxSearch()"
                  (input)="
                    saas.taxSearch.set($any($event.target).value);
                    taxCurrentPage.set(1)
                  "
                  class="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-2 pl-9 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Buscar país..."
                />
              </div>
              @if (saas.currentUserIsAdmin()) {
              <app-button-primary
                [fullWidth]="false"
                [label]="'Añadir País'"
                [icon]="'add'"
                [iconClass]="'text-[18px]'"
                [labelClass]="'text-sm font-semibold'"
                [reversed]="false"
                (pressed)="saas.showAddTaxModal.set(true)"
              />
              }@else {
                <span class="text-sm text-on-surface-variant ">Solo administradores pueden editar, añadir impuestos y eliminar impuestos</span>
              }
            </div>

            <!-- Table -->
            <div class="overflow-x-auto w-full">
              <table
                class="w-full text-left text-sm text-on-surface whitespace-nowrap"
              >
                <thead
                  class="text-xs text-on-surface-variant bg-surface-container-highest border-b border-outline-variant uppercase font-body font-semibold"
                >
                  <tr>
                    <th class="px-6 py-4 tracking-wider" scope="col">País</th>
                    <th class="px-6 py-4 tracking-wider" scope="col">
                      Impuesto
                    </th>
                    <th class="px-6 py-4 tracking-wider w-48" scope="col">
                      Porcentaje (%)
                    </th>
                    <th
                      class="px-6 py-4 tracking-wider text-right"
                      scope="col"
                    ></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant font-body">
                  @for (t of paginatedTaxes(); track t.countryCode) {
                    <tr
                      class="hover:bg-surface-container-high transition-colors group"
                    >
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full overflow-hidden border border-outline-variant shrink-0 bg-surface-container-lowest flex items-center justify-center text-xs font-bold font-mono"
                          >
                            {{ t.countryCode.toUpperCase() }}
                          </div>
                          <span class="font-medium text-on-surface">{{
                            t.country
                          }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span
                          class="px-2.5 py-1 bg-surface-container-lowest border border-outline-variant rounded text-xs font-medium text-on-surface-variant"
                          >{{ t.taxName }}</span
                        >
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center rounded-md max-w-30">
                          <input
                            type="number"
                            step="0.01"
                            [value]="t.percentage"
                            (input)="
                              saas.updateTaxPercentage(
                                t.countryCode,
                                +$any($event.target).value
                              )
                            "
                            class="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-1.5 px-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-right font-mono"
                          />
                        </div>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                          @if (saas.currentUserIsAdmin()) {
                          <button
                            (click)="saveTaxLine(t)"
                            class="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-lowest transition-colors cursor-pointer"
                            title="Guardar"
                          >
                            <span class="material-symbols-outlined text-[18px]"
                              >check</span
                            >
                          </button>
                          <button
                            (click)="deleteTaxLine(t)"
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
                      <td
                        colspan="4"
                        class="px-6 py-8 text-center text-on-surface-variant"
                      >
                        No se han encontrado impuestos que coincidan con la
                        búsqueda.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Table Footer -->
            <div
              class="p-4 border-t border-outline-variant bg-surface-container-high font-body"
            >
              <div class="flex items-center justify-between gap-3">
                <p
                  class="text-sm text-on-surface-variant hidden sm:block font-body"
                >
                  Mostrando
                  <span class="font-medium text-on-surface">{{
                    taxDisplayStart()
                  }}</span>
                  a
                  <span class="font-medium text-on-surface">{{
                    taxDisplayEnd()
                  }}</span>
                  de
                  <span class="font-medium text-on-surface">{{
                    filteredTaxes().length
                  }}</span>
                  países
                </p>

                <nav
                  class="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end"
                >
                  <button
                    [disabled]="taxCurrentPage() === 1"
                    (click)="prevTaxPage()"
                    class="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-[20px]"
                      >chevron_left</span
                    >
                  </button>

                  <div class="flex items-center gap-1">
                    @for (p of taxPages(); track p) {
                      <button
                        (click)="taxCurrentPage.set(p)"
                        [class]="
                          p === taxCurrentPage()
                            ? 'w-8 h-8 flex items-center justify-center rounded-md bg-primary-container text-primary-fixed font-medium text-sm border border-primary/20'
                            : 'w-8 h-8 flex items-center justify-center rounded-md text-on-surface hover:bg-surface-container font-medium text-sm transition-colors border border-transparent hover:border-outline-variant cursor-pointer'
                        "
                      >
                        {{ p }}
                      </button>
                    }
                  </div>

                  <button
                    [disabled]="taxCurrentPage() === taxTotalPages()"
                    (click)="nextTaxPage()"
                    class="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-[20px]"
                      >chevron_right</span
                    >
                  </button>
                </nav>
              </div>
            </div>
          </div>
        }
      </div>
    </main>
  `,
})
export class Ajustes {
  saas = inject(Saas);

  activeTab = computed(() => this.saas.currentSettingsTab());
  feedbackMessage = signal<string>("");

  // Profile fields bindings signals
  profileName = signal("");
  profileSurname = signal("");
  profileEmail = signal("");
  currentPassword = signal("");
  newPassword = signal("");
  taxCurrentPage = signal(1);
  taxItemsPerPage = 5;

  constructor() {
    // Keep local form fields in sync with profile loaded from API.
    effect(() => {
      const p = this.saas.userProfile();
      this.profileName.set(p.name);
      this.profileSurname.set(p.surname);
      this.profileEmail.set(p.email);
    });

    // Clamp tax pagination after filtering or data mutations.
    effect(() => {
      const totalPages = this.taxTotalPages();
      const current = this.taxCurrentPage();
      if (current > totalPages) {
        this.taxCurrentPage.set(totalPages);
      }
    });
  }

  // Filtered Taxes computed
  filteredTaxes = computed(() => {
    const q = this.saas.taxSearch().toLowerCase().trim();
    return this.saas.taxes().filter((t) => t.country.toLowerCase().includes(q));
  });

  taxTotalPages = computed(() => {
    return Math.ceil(this.filteredTaxes().length / this.taxItemsPerPage) || 1;
  });

  taxPages = computed(() => {
    const total = this.taxTotalPages();
    const arr: number[] = [];
    for (let i = 1; i <= total; i++) arr.push(i);
    return arr;
  });

  paginatedTaxes = computed(() => {
    const start = (this.taxCurrentPage() - 1) * this.taxItemsPerPage;
    const end = start + this.taxItemsPerPage;
    return this.filteredTaxes().slice(start, end);
  });

  taxDisplayStart = computed(() => {
    if (this.filteredTaxes().length === 0) return 0;
    return (this.taxCurrentPage() - 1) * this.taxItemsPerPage + 1;
  });

  taxDisplayEnd = computed(() => {
    const calculatedEnd = this.taxCurrentPage() * this.taxItemsPerPage;
    return Math.min(calculatedEnd, this.filteredTaxes().length);
  });

  async saveProfile(): Promise<void> {
    try {
      await this.saas.updateCurrentUserProfile({
        name: this.profileName(),
        surname: this.profileSurname(),
        email: this.profileEmail(),
      });
      this.showFeedback("¡Información personal actualizada correctamente!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la información personal.";
      this.showFeedback(message);
    }
  }

  async updateCredentials(): Promise<void> {
    if (this.currentPassword().trim().length === 0) {
      this.showFeedback("Introduce la contraseña actual para continuar.");
      return;
    }

    if (this.newPassword().trim().length < 8) {
      this.showFeedback(
        "La nueva contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    try {
      await this.saas.updateCurrentUserPassword(this.newPassword());
      this.currentPassword.set("");
      this.newPassword.set("");
      this.showFeedback("¡Credenciales de seguridad actualizadas con éxito!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar las credenciales.";
      this.showFeedback(message);
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.saas.deleteCurrentUserAccount();
      this.profileName.set("");
      this.profileSurname.set("");
      this.profileEmail.set("");
      this.currentPassword.set("");
      this.newPassword.set("");
      this.showFeedback("Cuenta eliminada correctamente.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la cuenta.";
      this.showFeedback(message);
    }
  }

  // Helper pricing limits logic
  getPreviousLimit(level: number): number {
    const prevTier = this.saas.tiers().find((t) => t.level === level - 1);
    return prevTier && prevTier.limit !== null ? prevTier.limit : 50;
  }

  updateTierLimit(id: number, limit: number) {
    const tier = this.saas.tiers().find((t) => t.id === id);
    if (tier) {
      this.saas.updateTier(id, limit, tier.price);
    }
  }

  updateTierPrice(id: number, price: number) {
    const tier = this.saas.tiers().find((t) => t.id === id);
    if (tier) {
      this.saas.updateTier(id, tier.limit, price);
    }
  }

  addNewTier() {
    // Find last tier limit to establish next tier base
    const tiers = this.saas.tiers();
    const infTier = tiers.find((t) => t.limit === null);

    // Create new intermediate tier before infinite
    if (infTier) {
      const prevTiers = tiers
        .filter((t) => t.limit !== null)
        .sort((a, b) => (a.limit || 0) - (b.limit || 0));
      const lastLimit =
        prevTiers.length > 0 ? prevTiers[prevTiers.length - 1].limit || 0 : 10;
      const nextLimit = lastLimit + 25;
      const intermediatePrice = Math.max(10, infTier.price + 5);

      // Shift infTier id up
      this.saas.addTier(infTier.price, null); // adds infinite

      // Update the old infinite to be intermediate
      this.saas.updateTier(infTier.id, nextLimit, intermediatePrice);
      this.showFeedback("Nuevo tramo de tarificación intermedio añadido.");
    } else {
      this.saas.addTier(20, null);
    }
  }

  async saveTiersConfig(): Promise<void> {
    try {
      await this.saas.savePricingTiersConfig();
      this.showFeedback(
        "¡Tramos de precios guardados y sincronizados correctamente!",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los tramos de precios.";
      this.showFeedback(message);
    }
  }

  async saveTaxLine(tax: Tax): Promise<void> {
    try {
      await this.saas.persistTax(tax);
      this.showFeedback(
        `Porcentaje impositivo para ${tax.country} guardado con éxito.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `No se pudo guardar el impuesto de ${tax.country}.`;
      this.showFeedback(message);
    }
  }

  async deleteTaxLine(tax: Tax): Promise<void> {
    if (tax.id === undefined) {
      this.showFeedback(`No se pudo eliminar el impuesto de ${tax.country}.`);
      return;
    }

    try {
      await this.saas.deleteTaxById(tax.id);
      this.showFeedback(`Impuesto de ${tax.country} eliminado correctamente.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `No se pudo eliminar el impuesto de ${tax.country}.`;
      this.showFeedback(message);
    }
  }

  deleteTierLine(tierId: number): void {
    this.saas.deleteTier(tierId);
  }

  prevTaxPage(): void {
    if (this.taxCurrentPage() > 1) {
      this.taxCurrentPage.update((p) => p - 1);
    }
  }

  nextTaxPage(): void {
    if (this.taxCurrentPage() < this.taxTotalPages()) {
      this.taxCurrentPage.update((p) => p + 1);
    }
  }

  private showFeedback(msg: string) {
    this.feedbackMessage.set(msg);
    setTimeout(() => {
      this.feedbackMessage.set("");
    }, 5000);
  }
}
