# Memoria

Esta prueba la desarrollé en **Angular con TailwindCSS** y **Node.js (TypeScript) y SQLite.**

IMPORTANTE: En este documento se recoge primero una explicación breve de las fases y al final el desarrollo con prompts de cada una. 

## Planificación

El proyecto comienza con lápiz y papel. Para empezar hago una lista de las funcionalidades que requiere el software según los requisitos. Luego, otra de lo que considero personalmente que debería hacer a mayores. No pretendo crear un producto mínimo viable, sino una aplicación completa.

### Vistas obligatorias
- **Buscador y Dashboard.**
- **Detalle del Cliente.**
- **Formulario de Simulación Interactiva.**

### Vistas añadidas
- **Listado de todos los clientes:** Para tener más facilidades en la consulta y búsqueda.
- **Analíticas:** Página con datos generales que dan un overview de la situación.
- **Ajustes:** Página con 3 subpestañas (Perfil, Tramos e Impuestos).
  - *Perfil:* Permite cambiar los datos del usuario, la contraseña y borrar cuenta.
  - *Tramos:* Permite a los administradores editar la cantidad de tramos, cómo y cuándo aplican.
  - *Impuestos:* Permite a los administradores editar el impuesto que aplica a cada país para poder personalizarlo según las variaciones en la legislación.
- **Inicio de sesión:** Para añadir seguridad al software, ya que contiene información sensible.
- **Usuarios:** Gestión de usuarios. Solo visible para administradores.
- **Añadir usuario:** Modal que permite añadir nuevos usuarios. Solo visible para administradores.
- **Añadir cliente:** Modal que permite añadir nuevos clientes a la base de datos.
- **Modificar cliente:** Modal que permite editar los datos de un cliente, basado en el anterior.
- **Añadir impuesto:** Modal para añadir un nuevo impuesto personalizado. Solo visible para administradores.

## Front-end

Para tener un mayor control sobre el diseño (y evitar el estilo de web hecha en IA porque no me gusta) preparo un flujo utilizando la versión gratuita de Stitch y Google AI Studio. Esto crea una base muy refinada antes de haber empezado. Stitch genera el diseño en HTML que se exporta directamente a Google AI Studio para convertirlo a Angular. Estas dos herramientas son ambas de Google y están basadas en Gemini, por lo que funcionan muy bien juntas.

Una vez está el código base en Angular, el resto del proceso se realiza en Visual Studio Code con GitHub Copilot. Elijo esta herramienta sencillamente porque ya tenía pagada la versión premium.

Para dejar el front preparado, limpio cualquier error que pueda haber generado Google AI Studio. Elimino código extra, reestructuro los botones como componentes, añado la configuración de Tailwind de Stitch (que se había eliminado) y arreglo cualquier inconsistencia frente al diseño.

La organización de la carpeta frontend queda así:

```markdown
frontend/
├── .angular/                      # Caché interna de Angular
├── assets/                        # Recursos estáticos (imágenes, fuentes, etc.)
├── dist/                          # Entregables de compilación para producción
├── node_modules/                  # Dependencias del proyecto
├── public/                        # Archivos públicos accesibles directamente
└── src/                           # Código fuente de la aplicación
    ├── app/                       # Módulos, componentes y lógica principal
    │   ├── components/            # Componentes reutilizables de la aplicación
    │   │   ├── buttons/           # Botones globales del sistema
    │   │   │   ├── button-danger.ts
    │   │   │   ├── button-primary.ts
    │   │   │   ├── button-secondary.ts
    │   │   │   └── button-tertiary.ts
    │   │   ├── layout/            # Estructuras y marcos de navegación
    │   │   │   ├── mobile-bottom-menu.ts
    │   │   │   ├── sidebar-menu.ts
    │   │   │   └── top-menu.ts
    │   │   └── customer-card.ts   # Tarjeta visual para datos de clientes
    │   ├── pages/                 # Vistas y páginas principales de la aplicación
    │   │   ├── ajustes/           # Configuración
    │   │   ├── analiticas/        # Métricas y gráficas
    │   │   ├── clientes.ts        # Vista de listado de clientes
    │   │   ├── dashboard.ts       # Página principal
    │   │   ├── detalle-cliente.ts # Ficha detallada de un cliente
    │   │   ├── inicio-sesion.ts   # Pantalla de login
    │   │   ├── presupuestos.ts    # Simulador de presupuestos
    │   │   └── usuarios.ts        # Administración de usuarios
    │   ├── app.config.server.ts   # Configuración de Angular para el entorno de servidor
    │   ├── app.config.ts          # Configuración global de la aplicación cliente
    │   ├── app.css                # Estilos específicos del componente raíz
    │   ├── app.html               # Plantilla HTML base de la aplicación
    │   ├── app.routes.server.ts   # Rutas del servidor para prerenderizado
    │   ├── app.routes.ts          # Definición de rutas y navegación del cliente
    │   ├── app.spec.ts            # Pruebas unitarias de la app raíz
    │   ├── app.ts                 # Componente raíz principal (Root Component)
    │   ├── customer-card.spec.ts  # Pruebas unitarias de la tarjeta de cliente
    │   └── saas.ts
    ├── index.html                 # Archivo HTML principal de entrada
    ├── main.server.ts             # Punto de entrada para el renderizado del lado del servidor (SSR)
    ├── main.ts                    # Punto de entrada para el renderizado del lado del cliente (CSR)
    ├── server.ts                  # Configuración del servidor Node.js para SSR
    └── styles.css                 # Estilos globales del proyecto (e imports de Tailwind)
```

## Instrucciones para IA

Primero creo el front ya que me ayuda a planear las necesidades específicas del back. Pero ahora tengo una base sólida, creo el repositorio y empiezo configurando la IA.

Organizo la carpeta `/ai-workspace/` de la siguiente manera: `/specs` (para los requisitos), `/architecture` (para el diseño del sistema). Dentro de Specs creo `business_logic.md`, que explica la lógica del negocio, `api_contracts.md`, el spec de la API y `db_schema.md` para el spec de la base de datos.


```markdown
ai-workspace/
├── DESIGN.md
├── architecture/
│   └── guidelines.md
└── specs/
		├── api_contracts.md
		├── business_logic.md
		└── db_schema.md
.github/
└── copilot-instructions.md
```

Todos estos archivos me permiten ofrecer la información a la IA de manera selectiva, haciendo los prompts mucho más sencillos y breves. Veámoslos archivo por archivo:

#### DESIGN.md

Define las especificaciones visuales de la interfaz. Para crearlo utilizo el archivo que generó Stitch como base pero añadiendo la configuración de Tailwind, la lógica de botones…

#### guidelines.md

Establece las reglas arquitectónicas del proyecto, la separación de responsabilidades por capas (Routes, Controllers, Services, Repositories) y las convenciones de codificación.

#### api_contracts.md

Documenta los contratos de la API REST, especificando los endpoints, métodos HTTP y las estructuras de datos para la comunicación entre el cliente y el servidor.

#### business_logic.md

Detalla las reglas de negocio críticas, como el algoritmo de facturación acumulativa por tramos y los procedimientos técnicos para la validación de documentos de identidad.

#### db_schema.md

Describe la estructura de las tablas de la base de datos SQLite, sus relaciones de uno a muchos y las restricciones de integridad como el borrado en cascada.

#### copilot-instructions.md

Como uso Github Copilot, es importante que este se encuentre en esa ruta específica y con este nombre. Este documento explica el contenido de la carpeta `ai-workspace`. De manera que la IA puede referenciar estos archivos de manera autónoma cuando los necesita.

## Backend

Creo el agente `backend.agent.md` con el propósito de limitar su scope a las carpetas del backend. De esta manera trabaja solo en los apartados a los que quiero darle acceso, sin intervenir en el frontend. 

Utilizando `guidelines.md` solicito al agente que cree las dependencias. Después, solicito que genere `.eslintrc.json` y `.prettierrc` estrictos para asegurar el control de calidad.

Utilizo el archivo `db_schema.md` para generar la conexión a SQLite. Como ya había definido todo anteriormente, la IA tiene toda la información necesaria para construir las bases de datos.

- **customers**: Almacena la información de las empresas o clientes que utilizan la aplicación.
- **simulations**: Almacena las simulaciones de costes realizadas por cada cliente.
- **taxes**: Almacena el impuesto aplicable por país (unificado al inglés para consistencia de base de datos).
- **pricing_tiers**: Almacena la configuración de tramos de facturación.
- **users**: Almacena los usuarios internos de la aplicación con su rol y credenciales de acceso.

Con las bases de datos ya creadas, genero los endpoints con la información de `api_contracts.md`.

Utilizo la información de `business_logic.md` y genero tanto el validador de DNI como los cálculos de tramos y la gestión de impuestos.

## Integración

Comienzo la configuración conectando la URL del back en el front. 

Para no dejarme nada sin conectar, realizo un mapeo de la interfaz. Busco todos los puntos que deberían conectar con el back, para luego ordenarlos por sus características. 

Verifico las conexiones para asegurarme de que funcionan y las voy resolviendo una a una.

Para terminar, hago una prueba general de la app, compruebo que todo funciona y redacto el `README.md`.

---

&nbsp;
# Prompts y proceso

## Front-end

El flujo de diseño UX/UI comienza desde Stitch. Esta herramienta es especialmente buena generando diseños de interfaces. Sin embargo, desde su versión 3.1 generó bastantes problemas de inconsistencia. Por esto será importante elegir la mejor versión de los menús de navegación para colocarlos entre todos.

El **estilo general y el dashboard** se generan con el siguiente prompt:

> Diseña la interfaz para "SaaS-O-Matic", una herramienta interna de panel de control (dashboard) para equipos de ventas. El objetivo es que los comerciales puedan buscar clientes corporativos y simular presupuestos de suscripción multi-divisa de forma rápida y visual.
> 
> [Estilo Visual]: Diseño limpio, moderno y profesional (estilo profesional "Enterprise" o "Fintech"). Utiliza principios de Atomic Design. Paleta de Colores: Modo oscuro. Colores de acento corporativos. Tipografía Sans-Serif clara. Bordes redondeados. Enfoque responsivo desktop.
> 
> [Vista Específicas] Vista de Buscador y Dashboard Principal (Home)
> 
> Descripción de la Vista: Esta es la pantalla principal. Debe mostrar un texto “¿Qué quieres hacer?” acompañado de dos botones “Añadir cliente” y “Nuevo presupuesto”.
> 
> Debajo un campo de búsqueda central con un texto de marcador de posición: "Buscar empresa por nombre o CIF (ej. B12345678)...".
> 
> Debajo del buscador, muestra una cuadrícula (grid) de "Clientes Recientes" usando tarjetas (cards). Cada tarjeta debe mostrar: Nombre de la empresa, CIF, País, badges que representen el plan (las opciones de plan son "Plan Starter", "Plan Pro", "Plan Enterprise") y un botón de "Ver Detalles". Incluye un menú lateral, en la parte superior añade el nombre "SaaS-O-Matic" a modo de logo, las páginas (Dashboard, Clientes, Presupuestos, Analíticas y Ajustes), dos botones en la parte inferior del menú lateral para “Añadir cliente” (botón secundario) y “Nuevo presupuesto” (botón primario).

Además se añade el estilo Obsidian, con el siguiente `DESIGN.md`:

```markdown
# Obsidian — High-Contrast Dark

## North Star: "Precision in Darkness"

Developer-grade dark UI. Near-black surfaces, high-contrast text, and precise accent colors. Clean, fast-feeling, and functional.

## Colors

- **Primary (`#a78bfa`):** Soft violet — interactive elements, links, focus rings.
- **Background (`#09090b`):** True near-black.
- **Tertiary (`#34d399`):** Emerald green — success states, positive indicators, code highlights.
- **Surface scale:** Zinc-based grays (`#0c0c0f` → `#27272a`). Very subtle increments.
- Red (`#ef4444`) for errors only. No decorative color use.

## Typography

- **All fonts:** Geist — modern, clean, developer-friendly.
- Tight letter-spacing on headings (-0.02em). Standard on body.
- `#fafafa` for primary text, `#a1a1aa` for secondary. High contrast always.

## Elevation

- Minimal shadows. Use border-based separation: `1px solid #27272a`.
- Active/hover states: subtle background shifts to next surface tier.
- Focus rings: `2px solid #a78bfa` with `2px offset`.

## Components

- **Buttons:** Primary = solid violet fill. Secondary = transparent + border. Ghost = text only, visible on hover.
- **Cards:** `surface_container` background, thin `outline_variant` border, 8px radius.
- **Inputs:** `surface_container` fill, `outline_variant` border, violet focus ring.
- **Code blocks:** `surface_container_lowest` background, monospace font.

## Rules

- Never use light backgrounds. Maintain zinc gray consistency.
- Borders over shadows for separation. Keep the interface flat and precise.
- Accent colors for function, never decoration.
```

Una vez se crea el dashboard paso a crear las distintas páginas:

**Detalles de cliente:**

> Diseña la vista de Detalle del Cliente y Simulaciones (El "Perfil").
> 
> Descripción de la Vista: Panel de control centrado en un cliente seleccionado.
> 
> Lado Izquierdo (Panel Fijo): Una tarjeta de "Información del Cliente" con: Nombre de la empresa, CIF, Email de contacto, País y Plan ("Plan Starter"). Además un botón de “Editar Cliente”.
> 
> Área Principal (Derecha): Un listado histórico de "Presupuestos Guardados". Muestra una tabla o lista de tarjetas con: Fecha, Usuarios Simulados, Coste Total, Divisa y un botón de "Editar presupuesto".

**Listado de todos los clientes:**

> Diseña la pantalla a pantalla completa dedicada a listar el directorio de clientes corporativos registrados.
> 
> **Cabecera y Controles de Búsqueda:**
> En la parte superior, incluye el título de la sección ("Todos los Clientes"). Justo debajo, coloca una barra de búsqueda amplia y prominente con el texto de ejemplo "Buscar empresa por nombre o CIF...". A la derecha de la barra de búsqueda, incluye un botón o selector para "Filtros" (por ejemplo, para filtrar por País o Plan) y el botón de acción principal "+ Nuevo Cliente".
> 
> **Cuadrícula Principal (Grid):**
> El área central de la pantalla debe ser una cuadrícula (grid) estructurada que muestre múltiples clientes. Instrucción crítica: Para representar a los clientes, debes reutilizar exactamente el mismo modelo de "Tarjeta de Cliente" (Customer Card) que se definió previamente para el Dashboard. No generes un diseño de lista ni un formato de tarjeta nuevo; mantén la consistencia absoluta con el componente del dashboard. Muestra unas 6 u 8 tarjetas con datos ficticios variados para simular la vista poblada.
> 
> **Navegación Inferior:**
> Al final de la cuadrícula, incluye controles de paginación estándar (flechas de "Anterior/Siguiente" y números de página) para indicar que la lista continúa.

**La vista de simulador de presupuesto:**

> Diseña la vista de Formulario Calculadora de Presupuesto.
> 
> Descripción de la Vista: Esta es la vista más interactiva. Debe estar visible junto al Detalle del Cliente.
> 
> El Simulador: En la parte superior, un selector de cliente con buscador integrado. Debajo un control de deslizamiento (Slider) grande y horizontal para ajustar el "Número de Usuarios Activos". Debe ir de 1 a 100+ usuarios.
> 
> Visualización de Costes: Debajo del slider, muestra dos tarjetas una al lado de la otra:
> "Coste Base Mensual" (en EUR).
> "Total Factura (con IVA % del país)" (destacado en grande).
> 
> Controles Multi-divisa: Junto al Total de la Factura, incluye un menú desplegable (Dropdown) estilizado para cambiar la divisa (EUR, USD, GBP, etc.). Al cambiarlo, los números de Coste Base y Total deben actualizarse visualmente en tiempo real con una pequeña animación.
> 
> Además al final debe haber dos botones, “Guardar” (secundario) y “Guardar y descargar pdf” (primario).

**Panel de Ajustes y Configuración:**

> Diseña la pantalla de configuración del sistema. La vista debe estar dividida en dos secciones: un menú de navegación lateral (Sidebar) con tres pestañas principales ("Perfil", "Tramos de Precios" y "Gestión de Impuestos").
> 
> 1. Estado Activo - Tramos de Precios (Tiered Pricing): El área principal muestra un constructor visual de tarifas. Debe contener una lista de filas o tarjetas apiladas, donde cada una representa un tramo. Cada tramo tiene inputs numéricos editables: "Hasta [ ] usuarios" y el input de "Precio: [ ] € / usuario". A la derecha de cada fila, un icono sutil de papelera para eliminarlo. Debajo de la lista, un botón fantasma (ghost button) para "+ Añadir nuevo tramo" y en la esquina inferior derecha un botón principal de "Guardar Configuración".
> 
> 2. Estado Activo - Gestión de Impuestos por País: Muestra una tabla de datos limpia y minimalista. En la cabecera: un buscador rápido (ej. "Buscar país...") y un botón "+ Añadir País". Las columnas de la tabla son: "País" (con espacio para una pequeña bandera de avatar), "Nombre del Impuesto" (ej. IVA, VAT, Sales Tax) y una celda con un campo editable (input) para el "Porcentaje (%)". Debe sugerir que la edición es en línea (inline editing).
> 
> 3. Estado Activo - Perfil de Usuario: Un layout de formulario limpio dividido en dos bloques. Bloque superior: Un avatar circular grande con un pequeño icono de cámara para cambiar la foto, junto a campos de texto para "Nombre", "Apellidos" y "Correo Electrónico". Bloque inferior: Una zona de seguridad delineada con campos para "Contraseña Actual", "Nueva Contraseña" y un botón de "Actualizar Credenciales".

**Vista de analíticas:**

> 1. Sección Superior (Ancho completo):
> Diseña un área que agrupe visualmente a los clientes según su nivel de suscripción: "Plan Starter", "Plan Pro" y "Plan Enterprise". Represéntalo preferiblemente como tres columnas o paneles horizontales que ocupen todo el ancho de la pantalla.
> 
> 2. Sección Inferior (Dos tarjetas grandes):
> Justo debajo, divide el espacio en dos grandes tarjetas (50% de ancho cada una):
> Tarjeta 1: "Ranking de clientes por país". Muestra una lista ordenada o un gráfico de barras horizontal simple que incluya el nombre del país, una pequeña bandera y la cantidad de clientes.
> Tarjeta 2: "Clientes totales registrados". Un panel de KPI destacando el número total de clientes con una tipografía de gran tamaño.

**Inicio de sesión:**

> Diseña una pantalla de login con un diseño centrado y minimalista.
> 
> 1. Contenedor Principal:
> Una tarjeta central que incluya el nombre de la herramienta "SaaS-O-Matic" en la parte superior y un título breve de bienvenida (ej. "Inicia sesión en tu cuenta").
> 
> 2. Formulario:
> Un campo de entrada (input) para "Correo Electrónico" con su respectiva etiqueta (label).
> Un campo de entrada para "Contraseña", que incluya un pequeño icono de un ojo en el extremo derecho para mostrar/ocultar los caracteres.
> Un texto sutil debajo que diga “Si has olvidado tus datos de acceso ponte en contacto con el administrador”.
> 
> 3. Acción Principal:
> Un botón de acción primario que ocupe todo el ancho del formulario (full-width) con el texto "Iniciar Sesión".

**Pop up para añadir un cliente nuevo:**

> Descripción del Modal/Pop-up: Registrar Nuevo Cliente Corporativo
> 
> Diseña una ventana modal, centrada en la pantalla sobre una capa de superposición oscura (overlay). El título del modal es "Registrar Nuevo Cliente".
> 
> Estructura del Formulario: Utiliza un diseño de formulario limpio, preferiblemente en una sola columna para facilitar la lectura, con etiquetas de campo (labels) claras y placeholders descriptivos.
> 
> Campos:
> 1. "Nombre de Empresa": Input de texto estándar.
> 2. "Identificador Fiscal (NIF/CIF)" (Input de texto).
> 3. "País" (Dropdown): Este campo debe estar visible y preferiblemente cerca del inicio. Debe ser un selector estilizado con búsqueda integrada.
> 4. "Email de Contacto": Input de texto con validación de email estándar.
> 5. "Plan Elegido" (Dropdown): Con las opciones "Plan Starter", "Plan Pro", "Plan Enterprise".
> 
> Botones de Acción: En la parte inferior derecha del modal, coloca dos botones bien diferenciados: "Cancelar" (secundario) y "Guardar Cliente" (principal).

**Pop up para editar un cliente existente:** (utilizo el popup anterior como referencia)

> Basado en este modal, genera otro para editar un cliente existente, donde los campos ya están rellenados y el título diga "Editar cliente".

**Pop up para añadir un impuesto nuevo:**

> Diseña una pequeña ventana modal centrada sobre una capa de superposición oscura (overlay). El título del modal es "Añadir Impuesto".
> 
> Campos del Formulario (Layout compacto):
> "País" (Dropdown): Un selector que incluya un icono de flecha y muestre un país seleccionado con su respectiva bandera pequeña.
> "Nombre del Impuesto" (Input de texto): Un campo de texto estándar con un placeholder descriptivo (ej. "IVA, VAT, Sales Tax...").
> "Porcentaje" (Input numérico): Un campo más corto. Debe incluir el símbolo "%" integrado visualmente en el extremo derecho del propio input.
> 
> Botones de Acción:
> En la parte inferior derecha, coloca dos botones alineados: un botón secundario de "Cancelar" y un botón de acción principal que diga "Añadir Impuesto".

Todos estos prompts se generan con ayuda de un LLM. Para luego editarlos de forma que se ajusten a las necesidades concretas (ej: añadir página de ajustes, añadir los badges, solucionar errores, eliminar funcionalidades no planeadas…).

Además se hacen varios ajustes al diseño. Entre ellos, encontré un error por el que la configuración de Tailwind se colocaba antes de la propia llamada al script. De forma que los estilos dejaban de funcionar. Para descubrir el error y solucionarlo necesité revisar manualmente el código. Añadiendo el siguiente prompt a las pantallas que generaban errores:

> Asegúrate de que el script de Tailwind está antes de la configuración en el código ya que si no, no funciona. Es este script: `<script src="https://cdn.tailwindcss.com/?plugins=forms,container-queries"></script>`

El proceso entero puede comprobarse en este enlace: https://stitch.withgoogle.com/projects/13976024930997151583

#### Convertir los HTML a Angular

Ahora que el diseño está completado pasamos a Google AI Studio, donde se puede exportar el proyecto completo en Angular. Este proceso hace que empiece el desarrollo con una base muy definida que solo hay que ajustar. Para la exportación se utiliza el siguiente prompt:

> Actúa como un desarrollador experto en Angular, Tailwind CSS y UI/UX de alta fidelidad.
> 
> Tengo este archivo HTML estático con Tailwind CSS generado por Stitch que contiene el diseño perfecto de mi aplicación. Quiero convertirlo a componentes standalone de Angular utilizando Signals para el estado, pero respetando estrictamente el diseño visual original.
> 
> ### REGLAS DE ORO PARA LA MIGRACIÓN:
> 
>  **1. CERO REDISEÑO VISUAL:**  
> No inventes, simplifiques ni modifiques ninguna clase de Tailwind, color de fondo, sombras, bordes, márgenes o paddings. El HTML resultante debe ser visualmente idéntico al que te he proporcionado.
> 
> **2. PRESERVA LOS SVGS ORIGINALES:**  
> No sustituyas los iconos vectoriales SVG originales por emojis ni librerías de iconos genéricas a menos que te lo pida explícitamente. Mantén los SVGs del HTML estático tal cual.
> 
> **3. CONSERVACIÓN DE LA ESTRUCTURA:**  
> Si divides el HTML en subcomponentes (por ejemplo: `app-sidebar`, `app-header`, `app-dashboard`), asegúrate de mantener los contenedores padres y las clases de rejilla (`grid`, `flex`, `gap`) intactos en el layout principal para que la composición visual no se rompa.
> 
> **4. INYECCIÓN DE REACTIVIDAD (DYNAMIZATION):**  
> Tu única tarea es reemplazar el texto y las listas estáticas por directivas de Angular:
> 
> - Usa `*ngFor` o `@for` para renderizar colecciones de datos (ej. las tarjetas de clientes, filas de tablas).
> - Usa `*ngIf` o `@if` para alternar la visibilidad de modales y estados activos.
> - Vincula inputs de formulario con variables usando `[(ngModel)]` de forma bidireccional.
> - Utiliza Angular Signals para gestionar el estado de manera moderna y limpia en tus componentes y servicios.
> 
>  **5. SOLO CREA LAS VISTAS QUE TE PROPORCIONO**  
> Utiliza la siguiente estructura:
> - Dashboard/Home (dashboard.html)
> - Clientes (clientes.html)
> - Detalles de cliente (detalles-cliente.html)
> - Simulador de presupuestos (presupuesto.html)
> - Analíticas (analiticas.html)
> - Ajustes (con tres tabs: Perfil, Rango de Precios y Gestión de impuestos) (perfil.html, precios.html e impuestos.html)
> 
> 
> Modales:
> - Modal para añadir cliente (cliente-nuevo.html)
> - Modal para editar clientes existente (cliente-editar.html)
> - Modal para añadir un impuesto (impuesto-nuevo.html)
>
> 
> **6. PRIORIZA DASHBOARD PARA ELEMENTOS REPETIDOS**  
> Cuando generes elementos que se repiten como menús de navegación o componentes concretos, prioriza los que aparecen en el dashboard frente a otros diseños.

### Edición de Código

En Visual Studio Code se realizan las siguientes modificaciones: 

**Dashboard**
Se ha modificado el tamaño del campo de búsqueda respecto al diseño original, ahora ocupa todo el ancho. Se ha modificado el icono de la lupa por una X que limpia el texto escrito; esta X solo aparece cuando escribes algo en el campo de búsqueda.

**Layout**
Se han creado componentes de los menús para unificar el diseño en todas las pantallas y mejorar su eficiencia y consistencia. 

**Menú Superior**
Se han realizado varios ajustes respecto al diseño original: se han eliminado dos elementos, la imagen de perfil se ha sustituido por un icono de usuario con su nombre, se han unificado las *breadcrumbs* en todas las pantallas y se ha añadido un botón para cerrar sesión.

**Menú Lateral**
Se ha unificado el menú en todas las pantallas para mantener una interfaz consistente. Además, se ha eliminado el recuadro del logotipo y se ha añadido una nueva opción para la gestión de usuarios, visible únicamente para los administradores.

**Vista detallada de cliente**
Se ha implementado un botón para poder borrar el cliente si es necesario (Ojo, esto también elimina las simulaciones que tiene ese cliente). Se ha implementado un botón para poder eliminar las simulaciones y se ha cambiado el estilo del botón de editar respecto al diseño original.

**Analíticas**
Se ha actualizado el listado de países añadiendo funcionalidad de paginación, lo que permite visualizar la información de forma más eficiente.

**Botones**
En lugar de utilizar un único botón plano, se desarrollaron componentes independientes para cada tipo de botón, clasificándolos según su propósito: botones primarios, secundarios, terciarios y de peligro, esto favorece a la consistencia del diseño.

**Tarjeta de clientes**
Estas tarjetas originalmente estaban implementadas como código plano y se transformaron en un componente reutilizable. Al tratarse de un componente, puede utilizarse en diferentes partes de la aplicación sin necesidad de duplicar el código cada vez que se quiera incorporar. Esto facilita su mantenimiento, ya que cualquier modificación realizada en el componente se refleja automáticamente en todos los lugares donde se utiliza. Además, estas tarjetas incorporan un componente de botón secundario, lo que favorece la consistencia del diseño y la reutilización de elementos.

**Presupuesto**
Se han deshabilitado los botones hasta que se seleccione un cliente, lo que supone un cambio con respecto al diseño original. Además, el campo de selección de usuarios no solo muestra la lista de usuarios disponibles, sino que también permite escribir para realizar búsquedas y facilitar su selección.

**Modal Añadir País**
Se ha modificado el título y el botón respecto al diseño para que tenga consistencia, ya que en unos sitios estaba nombrado como "añadir país" y en otro "añadir impuesto".

**Modal Añadir cliente**
Se ha modificado el orden de los campos respecto al diseño y se ha subido a la parte superior el nombre de la empresa.

**Modal Editar cliente**
Se ha modificado el orden de los campos respecto al diseño y se ha subido a la parte superior el nombre de la empresa.

## Backend

Genero el proyecto con `npm init -y`, para crear el `package.json` y poder instalar las dependencias.

Creo un agente `backend.agent.md` con el propósito de limitar su scope a las carpetas del backend. De esta manera trabaja solo en los apartados a los que quiero darle acceso, sin intervenir en el frontend. Este es su prompt:

```markdown
---
name: backend
description: "Use when working on backend implementation in this workspace, especially TypeScript/Express API code, validation, business logic, and data access."
---

# Backend Agent

You are the backend specialist for this workspace.

## Scope
- Work only on backend implementation in the TypeScript application under `backend/`.
- Only touch files inside `backend/` unless the user explicitly asks for something else.
- Focus on implementation details, bug fixes, refactors, and validation for server-side code.
- Do not modify specs, prompts, or documentation unless the user explicitly asks for that.

## Working Style
- Start from the most relevant backend file, test, or failing command.
- Keep changes small and targeted.
- Preserve the existing code style and module structure.
- Do not expand into unrelated areas unless the task requires it.
- If a task requires going outside `backend/`, stop and ask for confirmation.

## Tool Preferences
- Prefer `read_file`, `grep_search`, `file_search`, and `get_errors` for local investigation.
- Use `apply_patch` for edits.
- Use `run_in_terminal` for one-shot validation commands such as linting, type checking, or tests.
- Avoid broad repo exploration when a nearby file, symbol, or spec is enough.

## Backend Rules
- Treat `backend/package.json` and `backend/tsconfig.json` as the primary project configuration references.
- Follow the current TypeScript and Node/Express conventions in the backend.
- Use the specs as read-only references for implementation decisions, but keep the task centered on code changes in `backend/`.
- Keep request and response shapes aligned with the documented contracts unless the task explicitly changes them.
- Prefer fixes that address the root cause rather than patching symptoms.

## Validation
- After editing, run the narrowest useful validation first.
- Prefer linting, targeted type checks, or the most relevant test command for the touched area.
- If a validation step fails, fix the same slice before widening the scope.

## Communication
- Report the concrete backend change, the validation run, and any remaining risks.
- If the request is ambiguous, ask only about the missing backend-specific detail needed to proceed.
```

**Instalación de dependencias**

Solicito al agente del backend que basándose en `guidelines.md` instale las dependencias nombradas con el siguiente prompt:

> “Usando el esquema en guidelines.md, instala las dependencias.”

**Dependencias de producción:**
- Node.js
- TypeScript
- Express
- SQLite como base de datos (`sqlite3`)
- `@types/sqlite3`
- CORS (`cors`)
- Variables de entorno con `dotenv`

**Las dependencias de desarrollo:**
- `@types/cors`
- `@types/express`
- `@types/node`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint`
- `eslint-config-prettier`
- `prettier`
- `ts-node`
- `tsx`
- `typescript`

Solicito a la IA que genere `.eslintrc.json` y `.prettierrc` estrictos para asegurar el control de calidad en los archivos:

> "Genera los archivos de configuración `.eslintrc.json` y `.prettierrc` estrictos para asegurar el control de calidad"

- *Setup de SQLite y Modelos:*
  - Prompt a la IA: "Usando el esquema en `db_schema.md`, genera la conexión a SQLite y sus tablas."
- *Endpoints:*
  - Prompt a la IA: "Usando el esquema en `api_contracts.md`, genera todos los endpoints así como sus controladores, modelos, rutas, servicios y repositorios."
- *Implementar el validador de DNI/NIF/CIF (TDD):*
  - Prompt a la IA: "Implementa el validador de DNI/NIF/CIF basándote en el cálculo del modelo 23 real y mirando el archivo `business_logic.md`, genera los *tests unitarios* con identificadores válidos e inválidos."
- *Impuestos:*
  - Prompt a la IA: "Implementa el cálculo de impuestos por país y almacena la información en la base de datos llamada `taxes`."
- *Implementar el motor de cálculo por tramos (Tiered Pricing):*
  - Prompt a la IA: "Implementa una función pura que reciba el número de usuarios y calcule el coste base usando los tramos definidos en `business_logic.md`. Escribe tests unitarios para los casos: 5, 15 y 55 usuarios, e inserte los datos en la base de datos llamada `pricing_tiers`. Añade la lógica de suma de impuestos (IVA/Tax) según el país recibido que se encuentra en la base de datos `taxes`."

**Modelo base de datos**

Le solicito al agente del backend que, usando el esquema que hay en `db_schema.md`, cree todas las tablas correspondientes usando SQLite.

**Ejemplo de código de una tabla en db_schema.md:**

```sql
CREATE TABLE simulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    budget_name TEXT NOT NULL,
    active_users INTEGER NOT NULL,
    storage REAL NOT NULL,
    api_calls INTEGER NOT NULL,
    total_cost REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE 
);
```

**Tabla `users`**

Esta tabla almacena los usuarios internos que acceden a la aplicación. En ella se registran los datos personales:
- `id`
- Nombre
- Apellido
- Dirección de correo electrónico
- Contraseña (que se almacena como hash)
- Rol que determina su nivel de acceso dentro del sistema

El campo de “rol” acepta dos valores: “admin” para usuarios con acceso completo y “usuario” para acceso estándar. 

Se crean 2 usuarios, uno con permisos de administrador y otro como usuario estándar. Estos usuarios se han de eliminar y crear unos nuevos cuando se lleve a producción real (se crearon para verificar la funcionalidad durante el desarrollo).

**Datos usuario administrador:**
- **Nombre:** David
- **Apellido:** Bahillo
- **Correo:** akisbahillo@gmail.com
- **Contraseña:** 123456789 (No es segura, es solo para desarrollo)

**Datos usuario estándar:**
- **Nombre:** Usuario
- **Apellido:** Demo
- **Correo:** akisbahillo@gmail.com
- **Contraseña:** 123456789 (No es segura, es solo para desarrollo)

**Tabla `customers`** 

Esta tabla almacena la información de las empresas. En ella se registran datos como:
- Nombre de la compañía
- Identificador fiscal
- Correo electrónico
- País
- Plan elegido

**Tabla `simulations`**

Esta tabla almacena las simulaciones realizadas. En ella se registran los parámetros utilizados para el cálculo del coste:
- Nombre del presupuesto
- Cantidad de usuarios
- Precio total
- Moneda
- Clave foránea (`customer_id`)

La relación operativa principal se da entre **customers** y **simulations**, mediante una clave foránea que permite que un cliente tenga varias simulaciones asociadas (por eso se toma `customer_id`).

Además, se han definido las siguientes restricciones sobre la clave foránea:
- **ON DELETE CASCADE**: Al eliminar un cliente, también se eliminan automáticamente todas sus simulaciones.
- **ON UPDATE CASCADE**: Si el identificador del cliente se modifica, las referencias en la tabla `simulations` se actualizan automáticamente.

**Tabla `taxes`**

La tabla `taxes` almacena los impuestos por país. En ella se registran parámetros como:
- Nombre del país
- Nombre del impuesto
- Porcentaje que aplica

**Tabla `pricing_tiers`**

La tabla `pricing_tiers` almacena la configuración de tramos utilizada por el algoritmo de facturación acumulativa. En ella se registran parámetros como:
- Nivel
- Límite de usuarios
- Precio por usuario

El último tramo debe tener `user_limit = NULL` para representar que no existe límite superior. Cuando la tabla está vacía, el backend inserta automáticamente una configuración inicial con tres tramos.

Las tablas `taxes` y `pricing_tiers` actúan como tablas de configuración y no dependen mediante claves foráneas de `customers` ni de `simulations`.

**Creación de endpoints**

Le solicito al agente del backend que usando el archivo `api_contracts.md` cree todos los endpoints, con sus respectivos Controladores, Modelos, Servicios, Repositorios y Rutas.

Los endpoints solicitados son los siguientes:

**Users**
- `POST /users/login`
- `POST /users` *(Solo para administradores)*
- `GET /users`
- `GET /users/{id}`
- `PUT /users/{id}` *(Solo para administradores)*
- `DELETE /users/{id}` *(Solo para administradores)*

**Customers**
- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `GET /customers/{id}/full`
- `PUT /customers/{id}`
- `DELETE /customers/{id}`

**Simulations**
- `POST /simulations`
- `GET /simulations`
- `GET /simulations/{id}`
- `PUT /simulations/{id}`
- `DELETE /simulations/{id}`

**Taxes (Impuestos)**
- `POST /taxes` *(Solo para administradores)*
- `GET /taxes`
- `GET /taxes/{id}`
- `PUT /taxes/{id}` *(Solo para administradores)*
- `DELETE /taxes/{id}` *(Solo para administradores)*

**Pricing Tiers (Tramos)**
- `POST /pricing-tiers` *(Solo para administradores)*
- `GET /pricing-tiers`
- `GET /pricing-tiers/{id}`
- `PUT /pricing-tiers/{id}` *(Solo para administradores)*
- `DELETE /pricing-tiers/{id}` *(Solo para administradores)*

**Validation DNI NIF CIF**

Le solicito al agente del backend que cree un archivo de `validation.ts` y revise el archivo `business_logic.md` para que utilice el algoritmo de verificación según el cálculo del módulo 23 real.

Se toma la parte numérica del DNI (8 cifras).
Se calcula el resto de dividir ese número entre 23.
Ese resto (de 0 a 22) se utiliza como índice de la tabla de letras.

**La secuencia de letras es:** 
`TRWAGMYFPDXBNJZSQVHLCKE`

**La fórmula:** 
```math
índice = número\_DNI \pmod{23}
```
`letra = "TRWAGMYFPDXBNJZSQVHLCKE"[índice]`

**Ejemplo:**
- **DNI:** 12345678
- `12345678 % 23 = 14`
- Posición 14 → Z
- **Resultado:** 12345678Z

**Implementación de Tramos de Precios**

Para la implementación de los tramos, se utiliza la base de datos `pricing_tiers` para que permita modificar sus valores en el futuro o añadir nuevos tramos cuando sea necesario. Estas operaciones estarán restringidas exclusivamente a los usuarios con permisos de administrador.

Se solicita al agente de backend que, basándose en la lógica de tramos descrita en el archivo `business_logic.md`, implemente el cálculo de precios utilizando un modelo acumulativo por tramos. Además, deberá almacenar la configuración de dichos tramos en la base de datos `pricing_tiers` y aplicar el IVA (Tax) correspondiente, obteniendo su valor desde la base de datos durante el cálculo del precio final.

**Ejemplo de tramos:**

| Tramo | Usuarios | Precio por usuario |
| --- | --- | --- |
| Tramo 1 | 1 a 10 | 10 € |
| Tramo 2 | 11 a 50 | 8 € |
| Tramo 3 | Más de 50 | 5 € |

- Impuesto (`taxes`) = Coste base * (porcentaje / 100).
- Coste final = Coste base + Impuesto.

## Integración

### **Configuración base**
- Configuración de la URL del backend en el frontend según el entorno de ejecución (Desarrollo/Producción).
- Habilitación de CORS, serialización/deserialización JSON y gestión global de errores en el backend.

### **Mapeo de la integración**
Se identifican todas las páginas y componentes del frontend, definiendo para cada uno:
- Los datos que consume.
- La base de datos o entidad implicada.
- Los endpoints correspondientes.
- Los métodos HTTP utilizados (GET, POST, PUT y DELETE).

### **Prueba de conexión inicial**
Se realiza una primera llamada al backend, por ejemplo, obteniendo un listado de registros, con el objetivo de verificar:
- La conectividad entre frontend y backend.
- La correcta recepción y procesamiento de respuestas en formato JSON.
- El uso adecuado de los códigos de estado HTTP.
- La gestión de errores y excepciones en el frontend.

### **Integración de funcionalidades**
- **Customers:** Creación, edición, eliminación y consulta de detalles.
- **Simulations:** Creación, cálculo de simulaciones, persistencia de resultados, edición, eliminación y consulta de detalles.
- **Taxes:** Creación, edición y eliminación.
- **Pricing Tiers (Tramos):** Creación, edición, eliminación y consulta de detalles.
- **Users:** Autenticación, autorización, listado, edición, eliminación y consulta de detalles.
