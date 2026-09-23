# 📋 JSON Payload Reference - Bingos y Cartones

## 🎯 Para CREAR UN BINGO

### Endpoint
```
POST /api/bingos
```

### JSON a Enviar (Request Body)
```json
{
  "name": "Mi Bingo Especial",
  "description": "Descripción del bingo",
  "startDate": "2024-03-20",
  "endDate": "2024-04-20"
}
```

### Ejemplo en Swagger
```
{
  "name": "Bingo Navidad 2026",
  "description": "Bingo especial para navidad",
  "startDate": "2024-12-01",
  "endDate": "2024-12-31"
}
```

### Response (Exitoso - 201)
```json
{
  "id": "cm3fz9vkq000108kw8h7g6k9a",
  "name": "Bingo Navidad 2026",
  "description": "Bingo especial para navidad",
  "startDate": "2024-12-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.999Z",
  "status": "ACTIVE",
  "createdAt": "2024-03-15T10:30:00.123Z",
  "updatedAt": "2024-03-15T10:30:00.123Z"
}
```

**Importante:** Copia el `id` del response, lo necesitarás para importar cartones.

---

## 🎫 Para CREAR UN CARTÓN INDIVIDUAL

### Endpoint
```
POST /api/bingos/{bingoId}/cards
```

### JSON a Enviar (Request Body)
```json
{
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
}
```

### Validaciones
- `cardNumber`: string único por bingo
- `numbers`: array de exactamente 10 números
- Cada número: entre 1 y 90
- Sin números duplicados

### Response (Exitoso - 201)
```json
{
  "id": "cm3fz9vkq000208kw8h7g6k9b",
  "bingoId": "cm3fz9vkq000108kw8h7g6k9a",
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86],
  "status": "AVAILABLE",
  "createdAt": "2024-03-15T10:30:00.123Z",
  "updatedAt": "2024-03-15T10:30:00.123Z"
}
```

---

## 📁 Para IMPORTAR CARTONES EN LOTE (CSV)

### Endpoint
```
POST /api/bingos/{bingoId}/cards/import
```

### Tipo de Request
**Multipart Form Data** (NO es JSON)

### Lo que Swagger espera
- Header: `Content-Type: multipart/form-data`
- Campo: `file` (archivo CSV)
- El archivo NO es JSON, es un archivo de texto plano

### Formato del Archivo CSV
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
14600003,3 12 19 33 40 48 55 67 79 85
```

**Importante:** 
- ❌ NO es JSON
- ✅ Es un archivo de texto con valores separados por comas/espacios
- La extensión es `.csv`

### Response (Exitoso - 200)
```json
{
  "total": 3,
  "imported": 3,
  "failed": 0,
  "errors": [],
  "importedAt": "2024-03-15T10:30:00.123Z"
}
```

---

## ✏️ Para ACTUALIZAR UN CARTÓN

### Endpoint
```
PATCH /api/bingos/{bingoId}/cards/{cardId}
```

### JSON a Enviar (Request Body)
```json
{
  "numbers": [1, 8, 15, 28, 35, 44, 52, 61, 75, 88]
}
```

### Response (Exitoso - 200)
```json
{
  "id": "cm3fz9vkq000208kw8h7g6k9b",
  "bingoId": "cm3fz9vkq000108kw8h7g6k9a",
  "cardNumber": "14600001",
  "numbers": [1, 8, 15, 28, 35, 44, 52, 61, 75, 88],
  "status": "AVAILABLE",
  "createdAt": "2024-03-15T10:30:00.123Z",
  "updatedAt": "2024-03-15T10:30:01.456Z"
}
```

---

## 🗑️ Para ELIMINAR UN CARTÓN

### Endpoint
```
DELETE /api/bingos/{bingoId}/cards/{cardId}
```

### Sin body (solo path parameters)

### Response (Exitoso - 200)
```json
{
  "message": "Cartón eliminado exitosamente",
  "id": "cm3fz9vkq000208kw8h7g6k9b"
}
```

---

## 🔍 Para LISTAR CARTONES DE UN BINGO

### Endpoint
```
GET /api/bingos/{bingoId}/cards
```

### Parámetros Query (opcionales)
```
?skip=0&take=10&status=AVAILABLE
```

### Sin body

### Response (Exitoso - 200)
```json
{
  "data": [
    {
      "id": "cm3fz9vkq000208kw8h7g6k9b",
      "bingoId": "cm3fz9vkq000108kw8h7g6k9a",
      "cardNumber": "14600001",
      "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86],
      "status": "AVAILABLE",
      "createdAt": "2024-03-15T10:30:00.123Z",
      "updatedAt": "2024-03-15T10:30:00.123Z"
    },
    {
      "id": "cm3fz9vkq000308kw8h7g6k9c",
      "bingoId": "cm3fz9vkq000108kw8h7g6k9a",
      "cardNumber": "14600002",
      "numbers": [1, 8, 15, 28, 35, 44, 52, 61, 75, 88],
      "status": "AVAILABLE",
      "createdAt": "2024-03-15T10:30:00.123Z",
      "updatedAt": "2024-03-15T10:30:00.123Z"
    }
  ],
  "meta": {
    "total": 2,
    "skip": 0,
    "take": 10
  }
}
```

---

## ⚠️ ERRORES COMUNES

### Error 1: CSV vs JSON en Importación
```
❌ Mal: Enviando un JSON con array "numbers"
✅ Bien: Enviando un archivo CSV de texto plano
```

### Error 2: Números en JSON vs CSV
```
❌ Mal CSV: 14600001,"[2,5,24,39,42,46,51,53,72,86]"
✅ Bien CSV: 14600001,2 5 24 39 42 46 51 53 72 86
```

### Error 3: Columnas del CSV
```
❌ Mal: solo una columna "numbers"
✅ Bien: dos columnas "cardNumber,numbers"
```

### Error 4: Cantidad de números
```
❌ Mal JSON: "numbers": [2, 5, 24, 39, 42, 46]  // 6 números
✅ Bien JSON: "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]  // 10 números
```

---

## 🧪 Cheat Sheet - Copiar y Pegar

### Crear Bingo (JSON)
```json
{"name":"Bingo Test 2024","description":"Para pruebas","startDate":"2024-01-01","endDate":"2024-12-31"}
```

### Crear Cartón (JSON)
```json
{"cardNumber":"14600001","numbers":[2,5,24,39,42,46,51,53,72,86]}
```

### Actualizar Cartón (JSON)
```json
{"numbers":[1,8,15,28,35,44,52,61,75,88]}
```

### Archivo CSV (Texto Plano - NO JSON)
```
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
14600003,3 12 19 33 40 48 55 67 79 85
```

---

## 🚀 Flujo Completo en Swagger

### Paso 1: Crear un Bingo
1. Abre http://localhost:3000/api/docs
2. Busca `POST /api/bingos`
3. Haz clic en "Try it out"
4. Reemplaza el JSON con:
```json
{"name":"Bingo Prueba Completa","description":"Test","startDate":"2024-01-01","endDate":"2024-12-31"}
```
5. Haz clic en "Execute"
6. **Copia el `id` del response**

### Paso 2: Verificar que el Bingo se creó
1. Busca `GET /api/bingos`
2. Haz clic en "Try it out" → "Execute"
3. Deberías ver tu bingo en la lista

### Paso 3: Importar Cartones
1. Busca `POST /api/bingos/{bingoId}/cards/import`
2. Haz clic en "Try it out"
3. Ingresa el `bingoId` que copiaste en Paso 1
4. Selecciona el archivo CSV `ejemplos-csv/cartones_ejemplo.csv` (o uno que hayas creado)
5. Haz clic en "Execute"
6. Response debe mostrar `"imported": 10` (o cuantos cartones hayas importado)

### Paso 4: Ver Cartones Importados
1. Busca `GET /api/bingos/{bingoId}/cards`
2. Haz clic en "Try it out"
3. Ingresa el mismo `bingoId`
4. Haz clic en "Execute"
5. Deberías ver los 10 cartones con sus números

### Paso 5: Ver Base de Datos
1. En terminal, ejecuta: `npm run prisma:studio`
2. Abre http://localhost:5555
3. Verás todas las tablas: Bingo, Card, CardNumber, etc.

---

## 📊 Resumen

| Operación | Tipo | Body | Archivo |
|-----------|------|------|---------|
| Crear Bingo | JSON | Sí | No |
| Crear Cartón | JSON | Sí | No |
| Actualizar Cartón | JSON | Sí | No |
| Importar CSV | Multipart | No | Sí (.csv) |
| Listar Cartones | - | No | No |
| Eliminar Cartón | - | No | No |

**La confusión:** Swagger para Importación no pide JSON, pide un **archivo CSV de texto plano**, por eso solo ves la opción de "file upload" cuando está bien configurado.
