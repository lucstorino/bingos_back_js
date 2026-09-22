# 📡 API ENDPOINTS - ROADMAP

## Resumen de Endpoints Planeados

Esta es la lista completa de endpoints que serán implementados en FASE 3-10.

---

## 🎯 BINGOS (FASE 3)

### Listado
```
GET /api/bingos
Query params:
  - page: int (default: 1)
  - limit: int (default: 10)
  - status: BingoStatus (DRAFT, SCHEDULED, ACTIVE, etc)

Response: 200 OK
{
  "data": [
    {
      "id": "...",
      "name": "Bingo Navidad 2026",
      "description": "...",
      "drawDate": "2026-12-25",
      "price": 10000,
      "status": "ACTIVE",
      "createdAt": "2026-09-21",
      "updatedAt": "2026-09-21"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Obtener uno
```
GET /api/bingos/:id

Response: 200 OK
{
  "id": "...",
  "name": "...",
  ...
}
```

### Crear
```
POST /api/bingos
Content-Type: application/json

Body:
{
  "name": "Bingo Año Nuevo 2027",
  "description": "...",
  "drawDate": "2027-01-01",
  "price": 15000,
  "status": "DRAFT"
}

Response: 201 Created
```

### Actualizar
```
PATCH /api/bingos/:id
Body: { campos a actualizar }
Response: 200 OK
```

### Eliminar
```
DELETE /api/bingos/:id
Response: 204 No Content
```

---

## 🎴 CARTONES (FASE 3-4)

### Listar cartones de un bingo
```
GET /api/bingos/:bingoId/cards
Query params:
  - page: int (default: 1)
  - limit: int (default: 50)
  - status: CardStatus (AVAILABLE, RESERVED, SOLD)
  - search: string (número de cartón)

Response: 200 OK
{
  "data": [
    {
      "id": "...",
      "cardNumber": "146001",
      "status": "AVAILABLE",
      "numbers": [1, 5, 12, 46, 48, 58, 62, 69, 70, 89]
    }
  ],
  "total": 20000,
  "page": 1,
  "limit": 50
}
```

### Listar disponibles
```
GET /api/bingos/:bingoId/cards/available
Query params: page, limit

Response: 200 OK
[cartones disponibles]
```

### Obtener cartón por número
```
GET /api/bingos/:bingoId/cards/:cardNumber

Response: 200 OK
{
  "id": "...",
  "cardNumber": "146001",
  "status": "AVAILABLE",
  "numbers": [1, 5, 12, 46, 48, 58, 62, 69, 70, 89]
}
```

### Obtener cartón por ID
```
GET /api/cards/:id

Response: 200 OK
{
  "id": "...",
  "cardNumber": "146001",
  "status": "AVAILABLE",
  "numbers": [...]
}
```

### Importar cartones (CSV)
```
POST /api/bingos/:bingoId/cards/import
Content-Type: multipart/form-data

File: cartones.csv
CSV format:
numero_carton,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10
146001,1,5,12,46,48,58,62,69,70,89
146002,3,7,14,25,31,44,53,66,72,88

Response: 200 OK
{
  "processed": 20000,
  "inserted": 19980,
  "rejected": 20,
  "errors": [
    {
      "row": 5,
      "reason": "Duplicate cardNumber",
      "cardNumber": "146001"
    }
  ]
}
```

---

## 👥 CLIENTES (FASE 5)

### Crear cliente
```
POST /api/customers
Body:
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "dni": "12345678",
  "address": "Calle Principal 123",
  "phone": "1234567890",
  "email": "juan@example.com"  // optional
}

Response: 201 Created
```

### Obtener cliente
```
GET /api/customers/:id

Response: 200 OK
{
  "id": "...",
  "firstName": "Juan",
  "lastName": "Pérez",
  ...
}
```

---

## 📋 ÓRDENES (FASE 5)

### Crear orden
```
POST /api/orders
Body:
{
  "cardId": "...",
  "bingoId": "...",
  "firstName": "Juan",
  "lastName": "Pérez",
  "dni": "12345678",
  "address": "Calle Principal 123",
  "phone": "1234567890",
  "email": "juan@example.com"
}

Response: 201 Created
{
  "id": "...",
  "customerId": "...",
  "bingoId": "...",
  "cardId": "...",
  "amount": 10000,
  "status": "PENDING",
  "payment": {
    "id": "...",
    "status": "PENDING",
    "externalId": null  // Se llena con MP
  }
}
```

### Obtener orden
```
GET /api/orders/:id

Response: 200 OK
```

### Obtener cartón de la orden
```
GET /api/orders/:orderId/card

Response: 200 OK
{
  "orderId": "...",
  "bingo": {
    "name": "Bingo Navidad 2026",
    "drawDate": "2026-12-25"
  },
  "card": {
    "cardNumber": "146001",
    "numbers": [1, 5, 12, 46, 48, 58, 62, 69, 70, 89]
  },
  "customer": {
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

---

## 🔐 RESERVAS (FASE 5)

### Reservar cartón
```
POST /api/cards/:cardId/reserve

Response: 201 Created
{
  "id": "...",
  "cardId": "...",
  "orderId": "...",
  "expiresAt": "2026-09-21T19:40:00Z"
}
```

### Obtener reserva
```
GET /api/reservations/:id

Response: 200 OK
```

### Cancelar reserva
```
POST /api/reservations/:id/cancel

Response: 200 OK
```

---

## 💳 PAGOS (FASE 6)

### Webhook de Mercado Pago
```
POST /api/payments/webhook
Content-Type: application/json
Authorization: Bearer <MP_WEBHOOK_SECRET>

Body:
{
  "id": "...",
  "resource": "/v1/payments/...",
  "data": {
    "id": "..."
  }
}

Response: 200 OK
{
  "status": "processed"
}
```

---

## 🏆 PREMIOS (FASE 8)

### Listar premios
```
GET /api/bingos/:bingoId/prizes

Response: 200 OK
[
  {
    "id": "...",
    "name": "1° Premio",
    "description": "$5.000.000",
    "amount": 5000000,
    "position": 1
  }
]
```

### Crear premio
```
POST /api/bingos/:bingoId/prizes
Body:
{
  "name": "1° Premio",
  "description": "$5.000.000",
  "amount": 5000000,
  "position": 1
}

Response: 201 Created
```

### Actualizar premio
```
PATCH /api/prizes/:id
Body: { campos a actualizar }
Response: 200 OK
```

### Eliminar premio
```
DELETE /api/prizes/:id
Response: 204 No Content
```

---

## 👑 GANADORES (FASE 8)

### Listar ganadores
```
GET /api/bingos/:bingoId/winners

Response: 200 OK
[
  {
    "id": "...",
    "bingoId": "...",
    "prizeId": "...",
    "cardNumber": "146001",
    "winnerName": "Juan Pérez",
    "description": "Ganador del primer premio"
  }
]
```

### Registrar ganador
```
POST /api/bingos/:bingoId/winners
Body:
{
  "prizeId": "...",
  "cardNumber": "146001",
  "winnerName": "Juan Pérez",
  "description": "..."
}

Response: 201 Created
```

### Actualizar ganador
```
PATCH /api/winners/:id
Body: { campos a actualizar }
Response: 200 OK
```

### Eliminar ganador
```
DELETE /api/winners/:id
Response: 204 No Content
```

---

## 🔐 AUTENTICACIÓN (FASE 9)

### Login
```
POST /api/auth/login
Body:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "eyJhbGc...",
  "refresh_token": "...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "roles": ["ADMIN"]
  }
}
```

### Crear usuario
```
POST /api/users
Body:
{
  "email": "user@example.com",
  "password": "password123",
  "roles": ["ADMIN", "OPERATOR"]
}

Response: 201 Created
```

### Obtener perfil
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
```

---

## 🔄 Flujo de Compra Completo

```
1. Usuario selecciona cartón
   GET /api/cards/:id

2. Sistema verifica disponibilidad
   (Backend valida estado AVAILABLE)

3. Crear cliente
   POST /api/customers

4. Crear orden
   POST /api/orders

5. Reservar cartón
   POST /api/cards/:cardId/reserve

6. Redirigir a Mercado Pago
   (Frontend maneja MP)

7. Usuario paga

8. MP envía webhook
   POST /api/payments/webhook

9. Backend actualiza estado
   Payment: APPROVED
   Order: PAID
   Card: SOLD

10. Generar y enviar PDF
    (Desacoplado)

11. Cliente obtiene cartón
    GET /api/orders/:orderId/card
```

---

## 📊 Códigos de Respuesta HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Éxito |
| 201 | Created - Recurso creado |
| 204 | No Content - Éxito sin contenido |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Sin autenticación |
| 403 | Forbidden - Sin autorización |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: cartón ya vendido) |
| 422 | Unprocessable Entity - Validación fallida |
| 500 | Internal Server Error - Error del servidor |

---

## 🔒 Autenticación en Headers

Para endpoints protegidos:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 📝 Ejemplo de Flujo: Reservar Cartón

```bash
# 1. Obtener cartón
curl http://localhost:3000/api/cards/123

# 2. Si está AVAILABLE, reservar
curl -X POST http://localhost:3000/api/cards/123/reserve
# Response incluye orderId y expiresAt

# 3. Usar el orderId para crear cliente y orden
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "123",
    "bingoId": "456",
    "firstName": "Juan",
    "lastName": "Pérez",
    "dni": "12345678",
    "address": "...",
    "phone": "...",
    "email": "..."
  }'

# 4. Esperar webhook de Mercado Pago
# Backend procesa automáticamente

# 5. Obtener cartón cuando Order esté PAID
curl http://localhost:3000/api/orders/789/card
```

---

## 🎯 Estado de Implementación

| Feature | FASE | Estado |
|---------|------|--------|
| Bingos CRUD | 3 | ⏳ Próximo |
| Cartones Consulta | 3 | ⏳ Próximo |
| Paginación | 3 | ⏳ Próximo |
| CSV Import | 4 | ⏳ Próximo |
| Clientes | 5 | ⏳ Próximo |
| Órdenes | 5 | ⏳ Próximo |
| Reservas | 5 | ⏳ Próximo |
| Mercado Pago | 6 | ⏳ Próximo |
| Webhook MP | 6 | ⏳ Próximo |
| PDF | 7 | ⏳ Próximo |
| Email | 7 | ⏳ Próximo |
| Premios | 8 | ⏳ Próximo |
| Ganadores | 8 | ⏳ Próximo |
| Auth JWT | 9 | ⏳ Próximo |
| Roles | 9 | ⏳ Próximo |
| Tests | 10 | ⏳ Próximo |
| Swagger | 10 | ⏳ Próximo |

---

**Cada endpoint será implementado siguiendo esta especificación en las próximas fases.**

**¡Mantener este documento como referencia para la implementación!**
