# 📋 Guía Completa: CSV vs JSON y Cómo Usar la Importación

## ❓ Tu Pregunta: "¿Cuál es el ejemplo que debe tener de JSON el CSV?"

### 🎯 Respuesta Directa

**CSV NO es JSON.** Son dos formatos completamente diferentes:

| Característica | CSV | JSON |
|---|---|---|
| **Significado** | Comma Separated Values (Valores Separados por Comas) | JavaScript Object Notation |
| **Formato** | Texto plano con filas y columnas | Estructura de objetos/arrays |
| **Extensión** | `.csv` | `.json` |
| **Uso típico** | Bases de datos, hojas de cálculo | APIs, APIs REST, configuraciones |
| **Legibilidad** | Directa | Estructurada |
| **Para Importación** | ✅ LO QUE USA NUESTRO PROYECTO | ❌ No se usa para importar CSV |

---

## 📊 EJEMPLO 1: Archivo CSV Correcta (lo que envías a Swagger)

### Formato
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
14600003,3 12 19 33 40 48 55 67 79 85
14600004,7 14 21 30 37 47 58 66 71 84
14600005,6 13 22 31 39 49 56 64 73 87
14600006,4 11 20 29 38 45 54 62 78 89
14600007,5 16 23 32 41 50 57 68 76 90
14600008,9 17 24 34 43 51 59 69 77 81
14600009,10 18 25 36 42 52 60 70 80 82
14600010,2 15 26 38 44 53 61 72 74 83
```

### Explicación de cada línea
```
cardNumber,numbers          ← ENCABEZADO (OBLIGATORIO)
↓          ↓
14600001,  2 5 24 39 42 46 51 53 72 86
  ↑                    ↑
ID único     10 números separados por ESPACIO
del cartón   (rango 1-90, sin duplicados)
```

### ¿Por qué no es JSON?
- No tiene llaves `{}`
- No tiene comillas alrededor de los valores
- Es texto plano separado por comas
- Excel y Google Sheets lo reconocen automáticamente

---

## 🔄 COMPARACIÓN: CSV vs JSON

### ❌ INCORRECTO: Intentar enviar JSON

```json
{
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
}
```

**❌ ESTO NO FUNCIONA PARA IMPORTACIÓN MASIVA**

Razón: El endpoint `/api/bingos/{bingoId}/cards/import` espera un **archivo CSV**, no un objeto JSON.

---

### ✅ CORRECTO: Enviar archivo CSV

**Archivo: `cartones.csv`**
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
```

**✅ ESTO FUNCIONA PARA IMPORTACIÓN MASIVA**

Razón: El endpoint espera un archivo multipart/form-data con estructura CSV.

---

## 🎯 ¿Cuándo Usar JSON y Cuándo CSV?

### Usar JSON Para:

**1. Crear UN cartón**
```
Endpoint: POST /api/bingos/{bingoId}/cards
Content-Type: application/json
Body:
{
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
}
```

**2. Actualizar UN cartón**
```
Endpoint: PATCH /api/bingos/{bingoId}/cards/{cardId}
Content-Type: application/json
Body:
{
  "numbers": [1, 8, 15, 28, 35, 44, 52, 61, 75, 88]
}
```

**3. Crear UN bingo**
```
Endpoint: POST /api/bingos
Content-Type: application/json
Body:
{
  "name": "Bingo Navidad 2026",
  "description": "Descripción",
  "drawDate": "2026-12-25T00:00:00Z",
  "price": 5000,
  "status": "ACTIVE"
}
```

---

### Usar CSV Para:

**Importar MUCHOS cartones de una vez**
```
Endpoint: POST /api/bingos/{bingoId}/cards/import
Content-Type: multipart/form-data
Archivo: cartones.csv (archivo de texto)

Contenido del CSV:
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
14600003,3 12 19 33 40 48 55 67 79 85
... (100s o 1000s de cartones)
```

---

## 🧪 PRUEBA EXITOSA EN SWAGGER

### Paso 1: Crear un Bingo

📌 **Endpoint:** `POST /api/bingos`

Haz clic en "Try it out" y reemplaza con:
```json
{
  "name": "Bingo Prueba CSV Test",
  "description": "Para importar cartones",
  "drawDate": "2026-10-23T01:01:46.264Z",
  "price": 5000,
  "status": "ACTIVE"
}
```

**Response esperado (201):**
```json
{
  "id": "cmudedyhv0000dvl6r0nzj7lq",
  "name": "Bingo Prueba CSV Test",
  "description": "Para importar cartones",
  "drawDate": "2026-10-23T01:01:46.264Z",
  "price": 5000,
  "status": "ACTIVE",
  "createdAt": "2026-09-23T01:02:18.899Z",
  "updatedAt": "2026-09-23T01:02:18.899Z"
}
```

**✅ Copia el `id`: `cmudedyhv0000dvl6r0nzj7lq`**

---

### Paso 2: Importar CSV

📌 **Endpoint:** `POST /api/bingos/{bingoId}/cards/import`

1. Haz clic en "Try it out"
2. Ingresa el `bingoId` que copiaste: `cmudedyhv0000dvl6r0nzj7lq`
3. **Selecciona archivo** → Elige `ejemplos-csv/cartones_ejemplo.csv`
4. Haz clic en "Execute"

**Response esperado (201):**
```json
{
  "total": 10,
  "imported": 10,
  "failed": 0,
  "errors": [],
  "importedAt": "2026-09-23T01:02:18.899Z"
}
```

✅ **Éxito: 10 cartones importados**

---

### Paso 3: Verificar Cartones Importados

📌 **Endpoint:** `GET /api/bingos/{bingoId}/cards`

1. Haz clic en "Try it out"
2. Ingresa el mismo `bingoId`: `cmudedyhv0000dvl6r0nzj7lq`
3. Haz clic en "Execute"

**Response esperado (200):**
```json
{
  "data": [
    {
      "id": "cmudeenkz0003dvl652055tq6",
      "cardNumber": "14600001",
      "status": "AVAILABLE",
      "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
    },
    {
      "id": "cmudeenl6000fdvl64j386ejd",
      "cardNumber": "14600002",
      "status": "AVAILABLE",
      "numbers": [1, 8, 15, 28, 35, 44, 52, 61, 75, 88]
    },
    // ... 8 cartones más
  ],
  "meta": {
    "total": 10,
    "skip": 0,
    "take": 10
  }
}
```

✅ **Éxito: 10 cartones en la BD**

---

### Paso 4: Ver en Base de Datos (Prisma Studio)

1. En terminal: `npm run prisma:studio`
2. Abre http://localhost:5555
3. Haz clic en "BingoCard" (tabla)
4. Verás los 10 cartones importados con sus números

**Captura de Prisma Studio:**

| id | bingoId | cardNumber | status | createdAt |
|----|---------|-----------|--------|-----------|
| cmudeenkz0003... | cmudedyhv0000... | 14600001 | AVAILABLE | 2026-09-23T00:16:29 |
| cmudeenl6000f... | cmudedyhv0000... | 14600002 | AVAILABLE | 2026-09-23T00:16:29 |
| cmudeenlb000r... | cmudedyhv0000... | 14600003 | AVAILABLE | 2026-09-23T00:16:29 |
| ... | ... | ... | ... | ... |

---

## 📋 VALIDACIONES DEL CSV

El parser CSV valida automáticamente:

✅ **Exactamente 10 números por cartón**
```csv
14600001,2 5 24 39 42 46 51 53 72 86  ✅ Válido (10 números)
14600001,2 5 24 39 42 46 51 53 72     ❌ Inválido (9 números)
14600001,2 5 24 39 42 46 51 53 72 86 90  ❌ Inválido (11 números)
```

✅ **Números entre 1 y 90**
```csv
14600001,2 5 24 39 42 46 51 53 72 86  ✅ Válido (todos en rango)
14600001,0 5 24 39 42 46 51 53 72 86  ❌ Inválido (0 fuera de rango)
14600001,2 5 24 39 42 46 51 53 72 95  ❌ Inválido (95 > 90)
```

✅ **Sin números duplicados**
```csv
14600001,2 5 24 39 42 46 51 53 72 86  ✅ Válido (todos únicos)
14600001,2 5 24 39 42 46 51 53 72 2   ❌ Inválido (2 aparece dos veces)
```

✅ **Columnas requeridas**
```csv
cardNumber,numbers                      ✅ Válido (ambas presentes)
cardNumber                              ❌ Inválido (falta "numbers")
numbers                                 ❌ Inválido (falta "cardNumber")
```

---

## 💡 CREACIÓN DE ARCHIVOS CSV

### Opción 1: Microsoft Excel

1. Abre Excel
2. Crea columnas:
   - A: `cardNumber`
   - B: `numbers`
3. Ingresa datos:
   - A2: `14600001`
   - B2: `2 5 24 39 42 46 51 53 72 86`
4. Guarda como → "CSV (Separado por comas)" → `.csv`

### Opción 2: Google Sheets

1. Abre Google Sheets
2. Crea columnas como Excel
3. Descarga → CSV

### Opción 3: Editor de Texto

1. Abre Notepad
2. Copia y pega:
```
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
```
3. Guarda como `cartones.csv`

### Opción 4: Usar nuestro ejemplo

El proyecto incluye: `ejemplos-csv/cartones_ejemplo.csv`

Úsalo como base y agrega tus cartones.

---

## 🔧 TROUBLESHOOTING

### ❌ Error: "CSV con estructura incompleta"

**Causa:** Faltan columnas o datos incompletos

**Solución:**
```csv
❌ cardNumber
   14600001

✅ cardNumber,numbers
   14600001,2 5 24 39 42 46 51 53 72 86
```

### ❌ Error: "Números duplicados en el cartón"

**Causa:** Un número aparece más de una vez

**Solución:**
```csv
❌ 14600001,2 5 24 39 42 46 51 53 72 2   (2 aparece dos veces)

✅ 14600001,2 5 24 39 42 46 51 53 72 86
```

### ❌ Error: "Cantidad incorrecta de números"

**Causa:** No son exactamente 10 números

**Solución:**
```csv
❌ 14600001,2 5 24 39 42  (5 números)
❌ 14600001,2 5 24 39 42 46 51 53 72 86 90  (11 números)

✅ 14600001,2 5 24 39 42 46 51 53 72 86  (10 números)
```

### ❌ Error: "Números fuera de rango"

**Causa:** Números < 1 o > 90

**Solución:**
```csv
❌ 14600001,0 5 24 39 42 46 51 53 72 86  (0 < 1)
❌ 14600001,2 5 24 39 42 46 51 53 72 95  (95 > 90)

✅ 14600001,2 5 24 39 42 46 51 53 72 86  (todos en 1-90)
```

### ❌ Swagger muestra solo opción "JSON", no "file"

**Causa:** Endpoint no está configurado para file upload

**Solución:** El proyecto ya lo tiene configurado, pero si ocurre:
- Asegúrate de que `@ApiConsumes('multipart/form-data')` esté en el controller
- Reinicia el servidor: `npm run start:dev`

---

## 🚀 RESUMEN FINAL

| Concepto | Explicación |
|----------|-------------|
| **CSV** | Archivo de texto plano con valores separados por comas/espacios |
| **JSON** | Estructura de datos para APIs (objetos y arrays) |
| **Para Crear 1 cartón** | Usa JSON en endpoint POST /api/bingos/{bingoId}/cards |
| **Para Importar 100+ cartones** | Usa CSV en endpoint POST /api/bingos/{bingoId}/cards/import |
| **Formato CSV requerido** | 2 columnas: `cardNumber` (ID único) y `numbers` (10 números) |
| **Validaciones automáticas** | 10 números, rango 1-90, sin duplicados |
| **Prueba en Swagger** | Sube archivo CSV → API procesa automáticamente → Respuesta JSON |
| **Ver datos** | Prisma Studio en http://localhost:5555 |

---

## 📚 Archivos Importantes

- **Endpoint CSV:** `src/bingos/bingos.controller.ts` línea 124-145
- **Parser CSV:** `src/cards/csv-import.service.ts` línea 22-60
- **DTO Cartones:** `src/cards/dto/create-card.dto.ts`
- **Archivo Ejemplo:** `ejemplos-csv/cartones_ejemplo.csv`
- **Documentación:** Verifica `CSV_FORMATO_REFERENCIA.md` y `JSON_PAYLOADS_REFERENCIA.md`

---

## ✅ Checklist Para Usar

- [ ] Tengo el archivo CSV con formato correcto
- [ ] CSV tiene exactamente 2 columnas: `cardNumber` y `numbers`
- [ ] Cada cartón tiene exactamente 10 números
- [ ] Los números están entre 1 y 90
- [ ] No hay números duplicados en cada cartón
- [ ] El separador es espacio o coma (no guiones)
- [ ] Archivo codificado en UTF-8
- [ ] Servidor corriendo: `npm run start:dev` en puerto 3000
- [ ] Tengo un bingoId válido para importar
- [ ] Estoy usando el endpoint POST `/api/bingos/{bingoId}/cards/import`
- [ ] Estoy enviando el archivo en formato multipart, no JSON
