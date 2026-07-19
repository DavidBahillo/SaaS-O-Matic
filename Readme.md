# SaaS-O-Matic

### Descripción del proyecto
Este proyecto corresponde a una prueba técnica desarrollada con una arquitectura cliente-servidor. Está compuesto por un frontend implementado en Angular, encargado de la interfaz de usuario y la interacción con el cliente, y un backend desarrollado en Node.js con TypeScript y Express, responsable de la lógica de negocio, la gestión de datos en SQLite y la exposición de una API REST para la comunicación con el frontend.

## Guia de arranque local

Esta guia explica como levantar la aplicacion en local, separando backend y frontend, con comandos listos para copiar.

## 1) Prerrequisitos

Antes de empezar, asegurate de tener instalado:

- Node.js 20 o superior
- npm (incluido con Node.js)

Comprobar versiones:

```bash
node -v
npm -v
```

## 2) Estructura del proyecto

El repositorio tiene dos aplicaciones:

- `backend/` -> API en Node.js + TypeScript
- `frontend/` -> Aplicacion Angular

## 3) Instalar dependencias 

Desde la raiz del proyecto (`SaaS-O-Matic`), ejecuta:

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## 4) Levantar backend

Abre una terminal nueva y ejecuta:

> **Antes de arrancar**, crea el archivo `.env` en la carpeta `backend/` copiando el archivo de ejemplo:
>
> ```bash
> cd backend
> cp .env.example .env
> ```
>
> Revisa los valores y ajústalos si es necesario:
>
> ```env
> PORT=3001
> DATABASE_PATH=data/app.db
> ```

```bash
cd backend

npm start
```

Que hace este comando:

- Ejecuta `tsx watch src/server.ts`
- Inicia el servidor backend en modo desarrollo
- Reinicia automaticamente al detectar cambios

Opcional: resetear base de datos (si necesitas datos limpios)

```bash
cd backend
npm run db:reset
```

## 5) Levantar frontend

Abre otra terminal (sin cerrar la del backend) y ejecuta:

```bash
cd frontend
ng serve
```

## 6) Acceder a la aplicacion

Con ambos procesos activos:

- Frontend: http://localhost:4200
- Backend: http://localhost:3001

## 7) Flujo recomendado (resumen rapido)

Terminal 1 (backend):

```bash
cd backend
npm install
npm start
```

Terminal 2 (frontend):

```bash
cd frontend
npm install
ng serve
```

## 8) Problemas comunes

### Error por dependencias

```bash
cd backend
npm install
cd frontend
npm install
```

### El backend no arranca

Comprueba errores de TypeScript:

```bash
cd backend
npm run typecheck
```

## 9) Ejemplo de payload cURL para probar la API rapidamente

Puedes crear un cliente de prueba contra el backend local con este comando:

```bash
curl -X POST http://localhost:3001/customers \
	-H "Content-Type: application/json" \
	-d '{
		"companyName": "Empresa Demo S.L.",
		"taxId": "00000000T",
		"contactEmail": "contacto@empresa.com",
		"country": "ES",
		"planId": "Plan Starter"
	}'
```

Y puedes crear una simulacion de prueba con este comando. Necesitas que el valor de `customerId` exista previamente:

```bash
curl -X POST http://localhost:3001/simulations \
	-H "Content-Type: application/json" \
	-d '{
		"customerId": 1,
		"activeUsers": 25,
		"storage": 120.5,
		"apiCalls": 50000,
		"currency": "EUR"
	}'
```

