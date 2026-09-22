# 🗂️ FASES DE IMPLEMENTACIÓN

Este documento describe las fases de desarrollo del backend Bingo.

## ✅ FASE 1: COMPLETADA

### Objetivos
- [x] Crear proyecto NestJS con TypeScript
- [x] Configurar PostgreSQL + Docker Compose
- [x] Instalar Prisma ORM
- [x] Crear estructura de directorios modular
- [x] Configuración global (CORS, validación, etc.)
- [x] Variables de entorno (.env, .env.example)

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
```

### Próximos Pasos
1. Levantar PostgreSQL: `docker compose up -d`
2. Crear base de datos: `npm run prisma:migrate`
3. Cargar datos de prueba: `npm run prisma:seed`

---

## 📋 FASE 2: Modelo de Datos y Migraciones

### Objetivos
- [ ] Ejecutar primera migración
- [ ] Verificar tablas en PostgreSQL
- [ ] Ejecutar seed
- [ ] Validar datos iniciales

### Comandos
```bash
# Levantar PostgreSQL
docker compose up -d

# Crear/actualizar BD
npm run prisma:migrate

# Cargar datos de prueba
npm run prisma:seed

# Ver datos visualmente
npm run prisma:studio
```

---

## 🎯 FASE 3: Módulo Bingos + Cartones (Consulta)

### Objetivos
- [ ] Crear DTOs para Bingo
- [ ] Crear BingosService
- [ ] Crear BingosController
- [ ] Implementar endpoints GET
- [ ] Implementar paginación en cartones

### Endpoints a Crear
```
GET    /api/bingos
GET    /api/bingos/:id
GET    /api/bingos/:id/cards
GET    /api/bingos/:id/cards?page=1&limit=50&status=AVAILABLE
```

### Módulos Necesarios
```
bingos/
├── bingos.module.ts
├── bingos.service.ts
├── bingos.controller.ts
└── dto/
    ├── create-bingo.dto.ts
    ├── update-bingo.dto.ts
    └── bingo-response.dto.ts

cards/
├── cards.module.ts
├── cards.service.ts
├── cards.controller.ts
└── dto/
    ├── card-response.dto.ts
    └── paginated-response.dto.ts
```

---

## 📤 FASE 4: Importación Masiva de Cartones (CSV)

### Objetivos
- [ ] Crear parser CSV
- [ ] Validar datos masivos
- [ ] Implementar transacciones
- [ ] Crear endpoint de importación

### Endpoint
```
POST /api/bingos/:bingoId/cards/import
Content-Type: multipart/form-data
```

### Módulos Necesarios
```
cards/
└── csv-import.service.ts
```

### Validaciones
- ✓ Columnas correctas
- ✓ Exactamente 10 números
- ✓ Números 1-90
- ✓ Sin duplicados
- ✓ Soporte para ~20.000 registros

---

## 👥 FASE 5: Clientes, Reservas y Órdenes

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

## 💳 FASE 6: Mercado Pago + Webhook

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

## 📄 FASE 7: PDF y Email

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

## 🏆 FASE 8: Premios y Ganadores

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

## 🔐 FASE 9: Autenticación Administrativa

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

## 🧪 FASE 10: Tests, Swagger y Documentación

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
✅ FASE 1: 100%
   - Proyecto NestJS creado
   - Prisma configurado
   - Docker Compose listo
   - Compilación exitosa

⏳ FASE 2: 0%
   - Próxima: Ejecutar migraciones

⏳ FASE 3-10: Por comenzar
```

---

## 🚀 Instrucciones para Continuar

### Próximos pasos inmediatos:

1. **Instalar Docker** (si aún no está instalado)
   - Descargar de: https://www.docker.com/products/docker-desktop

2. **Levantar PostgreSQL**
   ```bash
   docker compose up -d
   ```

3. **Ejecutar migraciones**
   ```bash
   npm run prisma:migrate
   ```

4. **Cargar datos de prueba**
   ```bash
   npm run prisma:seed
   ```

5. **Iniciar servidor**
   ```bash
   npm run start:dev
   ```

6. **Verificar que funciona**
   ```bash
   curl http://localhost:3000/api/health
   ```

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
