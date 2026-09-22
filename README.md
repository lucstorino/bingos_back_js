# 🎰 Bingo Backend API

Backend REST API para la plataforma de venta de cartones de bingo. Desarrollado con **NestJS**, **TypeScript**, **PostgreSQL** y **Prisma**.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Base de Datos](#base-de-datos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Seguridad](#seguridad)

## ✨ Características

- ✅ API REST completa para gestión de bingos
- ✅ Sistema de reserva de cartones con transacciones
- ✅ Importación masiva de cartones (CSV)
- ✅ Gestión de clientes y órdenes
- ✅ Integración preparada para Mercado Pago
- ✅ Webhook seguro para confirmación de pagos
- ✅ Gestión de premios y ganadores
- ✅ Validación robusta con class-validator
- ✅ CORS configurable
- ✅ Prisma ORM con migraciones
- ✅ Docker Compose para PostgreSQL

## 📦 Requisitos Previos

- **Node.js** v18.0.0 o superior
- **npm** v9.0.0 o superior
- **Docker** y **Docker Compose**
- **PostgreSQL** (o usar Docker Compose)

### Verificar versiones:

```bash
node --version
npm --version
docker --version
docker compose --version
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd bingo-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Generar cliente de Prisma

```bash
npm run prisma:generate
```

## ⚙️ Configuración

### 1. Crear archivo `.env`

Copia el archivo `.env.example` y personaliza según tus necesidades:

```bash
cp .env.example .env
```

### Configuración de variables:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://bingo:bingo@localhost:5432/bingo?schema=public"

# CORS
CORS_ORIGIN="http://localhost:5173"

# Reservation (temporal lock de cartones)
RESERVATION_MINUTES=10

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRATION="7d"

# Mercado Pago (se configurará después)
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=

# SMTP Configuration (se configurará después)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@bingo.com
```

## 🐳 Base de Datos

### Iniciar PostgreSQL con Docker Compose

```bash
docker compose up -d
```

Esto levantará:
- **PostgreSQL** en `localhost:5432`
- **Usuario:** bingo
- **Contraseña:** bingo
- **Base de datos:** bingo

### Verificar que PostgreSQL está corriendo:

```bash
docker compose ps
```

Debería mostrar el contenedor `bingo_postgres` como `Up`.

### Ver logs:

```bash
docker compose logs -f postgres
```

## 🔄 Migraciones y Seed

### 1. Ejecutar migraciones

```bash
npm run prisma:migrate
```

Esto crea todas las tablas en la base de datos.

### 2. Ejecutar seed (datos de prueba)

```bash
npm run prisma:seed
```

Esto crea:
- 1 Bingo de prueba (Navidad 2026)
- 100 cartones con 10 números cada uno
- 5 premios
- 3 clientes de prueba
- 2 órdenes de prueba

### 3. Ver datos en Prisma Studio (opcional)

```bash
npm run prisma:studio
```

Se abrirá una interfaz visual en `http://localhost:5555`

## ▶️ Ejecución

### Modo desarrollo (con hot-reload)

```bash
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3000`

### Modo producción

```bash
npm run build
npm run start
```

### Modo debug

```bash
npm run start:debug
```

## 📁 Estructura del Proyecto

```
bingo-backend/
│
├── src/
│   ├── auth/                 # Autenticación
│   ├── users/                # Gestión de usuarios
│   ├── bingos/               # Gestión de bingos
│   ├── cards/                # Gestión de cartones
│   ├── customers/            # Gestión de clientes
│   ├── orders/               # Gestión de órdenes
│   ├── payments/             # Procesamiento de pagos
│   ├── prizes/               # Gestión de premios
│   ├── winners/              # Gestión de ganadores
│   ├── reservations/         # Reservas de cartones
│   ├── notifications/        # Email y notificaciones
│   ├── pdf/                  # Generación de PDF
│   ├── common/               # Código compartido
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── decorators/
│   │   ├── exceptions/
│   │   └── utils/
│   ├── config/               # Configuración
│   ├── prisma/               # Servicio de Prisma
│   ├── app.module.ts         # Módulo principal
│   └── main.ts               # Punto de entrada
│
├── prisma/
│   ├── schema.prisma         # Schema de la BD
│   └── seed.ts               # Datos iniciales
│
├── docker-compose.yml        # Configuración Docker
├── .env                      # Variables de entorno (local)
├── .env.example              # Template de variables
├── tsconfig.json             # Configuración de TypeScript
├── package.json              # Dependencias
├── README.md                 # Este archivo
└── .gitignore                # Git ignore
```

## 🔌 API Endpoints

### Bingos

```
GET    /api/bingos              # Listar todos los bingos
GET    /api/bingos/:id          # Obtener un bingo
POST   /api/bingos              # Crear un bingo
PATCH  /api/bingos/:id          # Actualizar un bingo
DELETE /api/bingos/:id          # Eliminar un bingo
```

### Cartones

```
GET    /api/cards/:id                      # Obtener cartón con números
GET    /api/bingos/:bingoId/cards          # Listar cartones de un bingo
GET    /api/bingos/:bingoId/cards/available # Listar cartones disponibles
GET    /api/bingos/:bingoId/cards/:cardNumber # Obtener cartón por número
POST   /api/bingos/:bingoId/cards/import   # Importar cartones desde CSV
```

### Clientes

```
POST   /api/customers           # Crear cliente
GET    /api/customers/:id       # Obtener cliente
```

### Órdenes

```
POST   /api/orders              # Crear orden
GET    /api/orders/:id          # Obtener orden
GET    /api/orders/:id/card     # Obtener cartón de la orden
```

### Reservas

```
POST   /api/cards/:cardId/reserve        # Reservar cartón
GET    /api/reservations/:id             # Obtener reserva
POST   /api/reservations/:id/cancel      # Cancelar reserva
```

### Premios

```
GET    /api/bingos/:bingoId/prizes       # Listar premios
POST   /api/bingos/:bingoId/prizes       # Crear premio
PATCH  /api/prizes/:id                   # Actualizar premio
DELETE /api/prizes/:id                   # Eliminar premio
```

### Ganadores

```
GET    /api/bingos/:bingoId/winners      # Listar ganadores
POST   /api/bingos/:bingoId/winners      # Registrar ganador
PATCH  /api/winners/:id                  # Actualizar ganador
DELETE /api/winners/:id                  # Eliminar ganador
```

### Pagos

```
POST   /api/payments/webhook             # Webhook de Mercado Pago
```

## 🔒 Seguridad

### Principios implementados:

1. **Validación de entrada:** class-validator + DTOs
2. **Transacciones de BD:** Para operaciones críticas (reservas, pagos)
3. **CORS:** Configurable por variable de entorno
4. **Isolación de nivel:** SERIALIZABLE en operaciones críticas
5. **Datos sensibles:** NO se guardan datos de tarjetas
6. **Idempotencia:** Webhook seguro contra duplicados
7. **Rate limiting:** Preparado para futuras implementaciones

### Evitar Ventas Duplicadas:

- ✅ `FOR UPDATE` en queries críticas
- ✅ Unique constraints en BD
- ✅ Transacciones SERIALIZABLE
- ✅ Validación en backend (frontend no decide)

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm run test
```

### Ver cobertura

```bash
npm run test:cov
```

### Watch mode

```bash
npm run test:watch
```

## 📝 Comandos Útiles

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# Desplegar migraciones en producción
npm run prisma:migrate:deploy

# Abrir Prisma Studio
npm run prisma:studio

# Ejecutar seed
npm run prisma:seed

# Compilar a JavaScript
npm run build

# Linting
npm run lint
```

## 🛑 Detener servicios

```bash
# Detener PostgreSQL
docker compose down

# Detener y eliminar volúmenes
docker compose down -v
```

## 📚 Documentación Adicional

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 🤝 Contribuyendo

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

---

**Desenvolvimiento rápido:**

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar PostgreSQL
docker compose up -d

# 3. Crear BD y migraciones
npm run prisma:migrate

# 4. Cargar datos de prueba
npm run prisma:seed

# 5. Iniciar servidor
npm run start:dev
```

El backend estará listo en `http://localhost:3000` 🚀
