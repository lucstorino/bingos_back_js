# 🗂️ FASES DE IMPLEMENTACIÓN

Este documento describe las fases de desarrollo del backend Bingo.

## ✅ FASE 1: Infraestructura Base + BD + Módulos Lectura

### Descripción
Configuración completa del proyecto, infraestructura y primeros módulos de consulta.

### Objetivos
- [x] Crear proyecto NestJS con TypeScript
- [x] Configurar PostgreSQL + Docker Compose
- [x] Instalar Prisma ORM
- [x] Crear estructura de directorios modular
- [x] Configuración global (CORS, validación, etc.)
- [x] Variables de entorno (.env, .env.example)
- [x] Ejecutar migraciones de base de datos
- [x] Cargar datos de prueba
- [x] Crear DTOs para Bingo
- [x] Crear BingosService y BingosController
- [x] Implementar endpoints GET (Bingos y Cartones)
- [x] Implementar paginación en cartones

### Archivos Creados
```
✓ src/main.ts
✓ src/app.module.ts
✓ src/config/configuration.ts
✓ src/prisma/prisma.service.ts
✓ src/prisma/prisma.module.ts
✓ prisma/schema.prisma (8 entidades)
✓ prisma/seed.ts (datos de prueba)
✓ docker-compose.yml
✓ .env y .env.example
✓ package.json con scripts
✓ tsconfig.json
✓ README.md
✓ dist/ (compilado)

✓ src/bingos/ (módulo completo)
✓ src/cards/ (módulo lectura)
```

### Endpoints Implementados
```
GET    /api/bingos
GET    /api/bingos/:id
GET    /api/bingos/:id/cards
GET    /api/bingos/:id/cards?page=1&limit=50&status=AVAILABLE
```

### Verificación
```bash
# Levantar PostgreSQL
docker compose up -d

# Crear/actualizar BD
npm run prisma:migrate

# Cargar datos de prueba
npm run prisma:seed

# Iniciar servidor
npm run start:dev

# Probar endpoints
curl http://localhost:3000/api/bingos
curl http://localhost:3000/api/bingos/1
curl "http://localhost:3000/api/bingos/1/cards?page=1&limit=10"
```

---

## 📤 FASE 2: Importación Masiva de Cartones (CSV) ✅

### Descripción
Parser CSV robusto con validaciones masivas e importación por transacciones.

### Objetivos
- [x] Crear parser CSV
- [x] Validar datos masivos
- [x] Implementar transacciones
- [x] Crear endpoint de importación

### Endpoint Creado
```
POST /api/bingos/:bingoId/cards/import
Content-Type: multipart/form-data
```

### Archivos Creados
```
✓ src/cards/csv-import.service.ts
✓ src/cards/dto/import-cards.dto.ts
✓ ejemplos-csv/cartones_ejemplo.csv
✓ FASE2_CSV_IMPORT.md (documentación)
```

### Validaciones Implementadas
- ✅ Columnas correctas (cardNumber, numbers)
- ✅ Exactamente 10 números por cartón
- ✅ Números entre 1-90
- ✅ Sin duplicados en el cartón
- ✅ Sin duplicados por bingo
- ✅ Soporte para ~20.000 registros
- ✅ Transacciones por lotes de 1000

### Response
```json
{
  "total": 100,
  "imported": 98,
  "failed": 2,
  "errors": [
    { "row": 5, "cardNumber": "14600005", "error": "..." },
    { "row": 12, "cardNumber": "14600012", "error": "..." }
  ],
  "importedAt": "2024-03-15T10:30:00Z"
}
```

### Testing
```bash
# 1. Crear bingo
POST /api/bingos { ... }

# 2. Importar CSV
POST /api/bingos/{bingoId}/cards/import
# (adjuntar archivo cartones_ejemplo.csv)

# 3. Verificar
GET /api/bingos/{bingoId}/cards?page=1&limit=10
```

---

## 👥 FASE 3: Clientes, Reservas y Órdenes

### Objetivos
- [ ] Crear módulo Customers
- [ ] Crear módulo Reservations
- [ ] Crear módulo Orders
- [ ] Implementar lógica transaccional

### Endpoints
```
POST   /api/customers
POST   /api/cards/:cardId/reserve
POST   /api/orders
GET    /api/orders/:id
```

### Características Críticas
- ✓ Evitar doble reserva (FOR UPDATE)
- ✓ Transacciones SERIALIZABLE
- ✓ Expiración automática de reservas

### Módulos Necesarios
```
customers/
├── customers.module.ts
├── customers.service.ts
├── customers.controller.ts
└── dto/
    ├── create-customer.dto.ts
    └── customer-response.dto.ts

reservations/
├── reservations.module.ts
├── reservations.service.ts
├── reservations.controller.ts
├── reservation-expiry.task.ts
└── dto/
    └── create-reservation.dto.ts

orders/
├── orders.module.ts
├── orders.service.ts
├── orders.controller.ts
└── dto/
    ├── create-order.dto.ts
    └── order-response.dto.ts
```

---

## 💳 FASE 4: Mercado Pago + Webhook

### Objetivos
- [ ] Crear MercadoPagoService
- [ ] Implementar webhook
- [ ] Idempotencia de webhook
- [ ] Transiciones de estado

### Endpoints
```
POST /api/payments/webhook
```

### Módulos Necesarios
```
payments/
├── payments.module.ts
├── payments.service.ts
├── payments.controller.ts
├── mercado-pago.service.ts
└── dto/
    └── webhook-payment.dto.ts
```

### Flujo Crítico
```
Order PENDING
    ↓
User paga en MP
    ↓
MP envía webhook
    ↓
Backend valida
    ↓
Payment APPROVED + Order PAID + Card SOLD
```

---

## 📄 FASE 5: PDF y Email

### Objetivos
- [ ] Crear generador PDF
- [ ] Implementar envío de email
- [ ] Desacoplar email (background)

### Módulos Necesarios
```
pdf/
├── pdf.module.ts
└── pdf.service.ts

notifications/
├── notifications.module.ts
└── email.service.ts
```

### Trigger
Después de `Payment APPROVED` → Generar PDF → Enviar Email

---

## 🏆 FASE 6: Premios y Ganadores

### Objetivos
- [ ] Crear módulo Prizes
- [ ] Crear módulo Winners
- [ ] CRUD de premios y ganadores

### Endpoints
```
GET    /api/bingos/:bingoId/prizes
POST   /api/bingos/:bingoId/prizes
PATCH  /api/prizes/:id
DELETE /api/prizes/:id

GET    /api/bingos/:bingoId/winners
POST   /api/bingos/:bingoId/winners
PATCH  /api/winners/:id
DELETE /api/winners/:id
```

### Módulos Necesarios
```
prizes/
├── prizes.module.ts
├── prizes.service.ts
├── prizes.controller.ts
└── dto/
    ├── create-prize.dto.ts
    └── update-prize.dto.ts

winners/
├── winners.module.ts
├── winners.service.ts
├── winners.controller.ts
└── dto/
    ├── create-winner.dto.ts
    └── update-winner.dto.ts
```

---

## 🔐 FASE 7: Autenticación Administrativa

### Objetivos
- [ ] Crear módulo Auth
- [ ] Crear módulo Users
- [ ] JWT y Roles (ADMIN, OPERATOR)
- [ ] Guards y decoradores

### Módulos Necesarios
```
auth/
├── auth.module.ts
├── auth.service.ts
├── auth.controller.ts
├── jwt.strategy.ts
├── guards/
│   └── jwt.guard.ts
└── dto/
    ├── login.dto.ts
    └── auth-response.dto.ts

users/
├── users.module.ts
├── users.service.ts
├── users.controller.ts
└── dto/
    ├── create-user.dto.ts
    └── update-user.dto.ts

common/
├── decorators/
│   └── public.decorator.ts
├── guards/
│   └── roles.guard.ts
└── decorators/
    └── roles.decorator.ts
```

---

## 🧪 FASE 8: Tests, Swagger y Documentación

### Objetivos
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Swagger/OpenAPI
- [ ] Documentación completa

### Librerías Necesarias
```bash
npm install @nestjs/swagger swagger-ui-express
npm install --save-dev @nestjs/testing jest ts-jest @types/jest
```

### Endpoints a Documentar
- /api/docs (Swagger UI)

---

## 📊 ESTADO ACTUAL

```
✅ FASE 1: 100% - Infraestructura + BD + Módulos Lectura + ABM
   - Proyecto NestJS creado
   - Prisma configurado con migraciones
   - Docker Compose listo
   - Datos de prueba cargados
   - Módulos Bingos y Cartones con ABM completo
   - Endpoints GET funcionando
   - Paginación implementada

✅ FASE 2: 100% - Importación CSV
   - Parser CSV robusto
   - Validaciones masivas
   - Transacciones por lotes
   - Endpoint POST /bingos/:bingoId/cards/import
   - Manejo de errores con reporte

⏳ FASE 3-8: Por comenzar
```

---

## 🚀 Instrucciones para Continuar

### Verificar FASE 2

```bash
# 1. Iniciar servidor
npm run start:dev

# 2. Crear un bingo
curl -X POST http://localhost:3000/api/bingos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bingo Test",
    "description": "Test",
    "drawDate": "2024-03-15T20:00:00Z",
    "price": 100
  }'

# 3. Importar CSV
curl -X POST http://localhost:3000/api/bingos/{bingoId}/cards/import \
  -F "file=@ejemplos-csv/cartones_ejemplo.csv"

# 4. Listar cartones
curl "http://localhost:3000/api/bingos/{bingoId}/cards?page=1&limit=10"
```

### Próxima Fase (FASE 3): Clientes, Reservas, Órdenes

Para continuar, implementar:

1. Módulo Customers (CRUD)
2. Módulo Reservations (crear, expiración)
3. Módulo Orders (crear, transacciones)
4. Validaciones de doble reserva con FOR UPDATE
5. Transacciones SERIALIZABLE

---

## 📝 Notas Importantes

- **No hacer TODO de una vez**: Implementar por fases
- **Testing contínuo**: Probar cada fase antes de continuar
- **Git**: Hacer commits frecuentes
- **Documentación**: Mantener actualizada a medida que avanza

---

## 📞 Próximas Tareas

- [ ] Instalar Docker
- [ ] Levantar PostgreSQL
- [ ] Ejecutar migraciones
- [ ] Cargar seed
- [ ] Probar que la BD está funcionando
- [ ] Comenzar FASE 2/3: Crear módulo Bingos
