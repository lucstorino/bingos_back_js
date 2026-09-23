# 📊 CSV vs JSON - Comparación Visual

## 🎯 RESUMEN RÁPIDO

**Tu pregunta:** ¿Cuál es el ejemplo que debe tener de JSON el CSV?

**Respuesta:** ❌ El CSV **NO tiene JSON**. Son DOS formatos completamente diferentes.

---

## 🔄 LADO A LADO

### JSON (Para API REST)
```json
{
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
}
```

**Características:**
- Tiene `{ }`
- Tiene comillas `"`
- Es un objeto estructurado
- Usa `[` para arrays
- **Para crear 1 cartón**

---

### CSV (Para Importación Masiva)
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
14600003,3 12 19 33 40 48 55 67 79 85
```

**Características:**
- Es texto plano
- Filas y columnas
- Valores separados por comas
- Números separados por espacios
- **Para importar 100+ cartones**

---

## ✅ ¿Cuándo Usar Cada Uno?

### 1️⃣ CREAR 1 BINGO

```
Endpoint: POST /api/bingos
Content-Type: application/json
```

**Usa JSON:**
```json
{
  "name": "Bingo Navidad 2026",
  "description": "Bingo especial",
  "drawDate": "2026-12-25T00:00:00Z",
  "price": 5000,
  "status": "ACTIVE"
}
```

**Respuesta en JSON:**
```json
{
  "id": "cmudedyhv0000dvl6r0nzj7lq",
  "name": "Bingo Navidad 2026",
  ...
}
```

---

### 2️⃣ CREAR 1 CARTÓN

```
Endpoint: POST /api/bingos/{bingoId}/cards
Content-Type: application/json
```

**Usa JSON:**
```json
{
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
}
```

**Respuesta en JSON:**
```json
{
  "id": "cmudeenkz0003dvl652055tq6",
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86],
  "status": "AVAILABLE"
}
```

---

### 3️⃣ IMPORTAR 10-1000 CARTONES

```
Endpoint: POST /api/bingos/{bingoId}/cards/import
Content-Type: multipart/form-data
```

**Usa CSV:**
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
14600003,3 12 19 33 40 48 55 67 79 85
```

**Respuesta en JSON:**
```json
{
  "total": 3,
  "imported": 3,
  "failed": 0,
  "errors": []
}
```

---

## 🧠 Entender la Diferencia

### JSON
```
┌─────────────────────────────────┐
│         ENTRADA                 │
│   (Lo que ENVÍAS a la API)      │
│                                 │
│  {                              │
│    "cardNumber": "14600001",    │
│    "numbers": [2, 5, 24, ...]   │
│  }                              │
└─────────────────────────────────┘
         APLICACIÓN
  (Crea 1 cartón)
┌─────────────────────────────────┐
│         SALIDA                   │
│   (Lo que RECIBES de la API)    │
│                                 │
│  {                              │
│    "id": "cmudeenkz0003...",   │
│    "cardNumber": "14600001",    │
│    "status": "AVAILABLE"        │
│  }                              │
└─────────────────────────────────┘
```

### CSV
```
┌──────────────────────────────────┐
│  ARCHIVO CSV (texto plano)       │
│                                  │
│  cardNumber,numbers              │
│  14600001,2 5 24 39 42 46 ...   │
│  14600002,1 8 15 28 35 44 ...   │
│  14600003,3 12 19 33 40 48 ...  │
│                                  │
│  (10, 100, 1000 cartones)        │
└──────────────────────────────────┘
         APLICACIÓN
    (Importa MUCHOS cartones)
┌──────────────────────────────────┐
│    RESPUESTA EN JSON             │
│                                  │
│  {                               │
│    "total": 1000,               │
│    "imported": 1000,            │
│    "failed": 0,                 │
│    "errors": []                 │
│  }                               │
└──────────────────────────────────┘
```

---

## 📝 Archivos Reales

### 1. Archivo CSV - cartones_ejemplo.csv
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

**¿Qué es esto?**
- 10 filas de datos
- 2 columnas: `cardNumber` y `numbers`
- Cada fila es UN cartón
- Los números están separados por espacios
- ✅ Este es el formato CORRECTO

---

### 2. No Sería JSON de Esta Forma

```json
[
  {
    "cardNumber": "14600001",
    "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
  },
  {
    "cardNumber": "14600002",
    "numbers": [1, 8, 15, 28, 35, 44, 52, 61, 75, 88]
  }
]
```

**¿Por qué?**
- ❌ Endpoint de importación **no acepta JSON**
- ❌ Espera un **archivo CSV**
- ❌ Swagger solo mostraría opción JSON (no file)
- ✅ Pero SI lo usarías para una API diferente

---

## 🎬 EN SWAGGER

### Opción A: Para Crear 1 Cartón (JSON)
```
POST /api/bingos/{bingoId}/cards

📋 Request Body (application/json):
{
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
}
```

**Swagger Te Pide:**
```
[textarea con JSON]
```

---

### Opción B: Para Importar CSV (Archivo)
```
POST /api/bingos/{bingoId}/cards/import

📋 Request Body (multipart/form-data):
[file upload button]
```

**Swagger Te Pide:**
```
[Seleccionar archivo] → cartones.csv
```

**Diferencia clave:** 
- Opción A: Texto JSON en textarea
- Opción B: Archivo CSV con navegador de archivos

---

## 📊 Tabla Comparativa Completa

| Aspecto | JSON | CSV |
|---|---|---|
| **Formato** | Estructurado | Texto plano |
| **Caracteres especiales** | `{ } [ ] : " ,` | `,` (solo coma) |
| **Filas múltiples** | Array `[ ]` | Múltiples líneas |
| **Legible por humanos** | Estructura clara | Super legible |
| **Compatible Excel** | ❌ No | ✅ Sí |
| **Compatible Google Sheets** | ❌ No | ✅ Sí |
| **Para 1 registro** | ✅ Mejor | ❌ Overkill |
| **Para 1000+ registros** | ❌ Pesado | ✅ Ideal |
| **Validaciones automáticas** | API-level | Parser CSV |
| **Tamaño de archivo** | Mayor | Menor |
| **Velocidad importación** | Lenta | Rápida (lotes) |
| **Manejo de errores** | Por registro | Por lote |

---

## 💾 Cómo Crear tu Propio CSV

### Método 1: Excel/Google Sheets

1. Abre Excel
2. Celda A1: `cardNumber`
3. Celda B1: `numbers`
4. Celda A2: `14600001`
5. Celda B2: `2 5 24 39 42 46 51 53 72 86`
6. Guarda como → `.csv`

### Método 2: Notepad

1. Abre Notepad
2. Escribe:
```
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
```
3. Guarda como `cartones.csv`

### Método 3: Programáticamente

```python
# Python
import csv

data = [
    ['cardNumber', 'numbers'],
    ['14600001', '2 5 24 39 42 46 51 53 72 86'],
    ['14600002', '1 8 15 28 35 44 52 61 75 88'],
]

with open('cartones.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)
```

---

## 🚀 Prueba Completa

### Paso 1: Crear Bingo (JSON en API)
```bash
curl -X POST http://localhost:3000/api/bingos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bingo Test",
    "description": "Test",
    "drawDate": "2026-12-25T00:00:00Z",
    "price": 5000,
    "status": "ACTIVE"
  }'

RESPUESTA:
{
  "id": "cmudedyhv0000dvl6r0nzj7lq",
  "name": "Bingo Test",
  ...
}
```

### Paso 2: Importar CSV (Archivo)
```bash
curl -X POST http://localhost:3000/api/bingos/cmudedyhv0000dvl6r0nzj7lq/cards/import \
  -F "file=@cartones.csv"

RESPUESTA:
{
  "total": 10,
  "imported": 10,
  "failed": 0,
  "errors": []
}
```

**Nota:** `-F "file=@cartones.csv"` envía un **ARCHIVO**, no JSON

---

## ❌ ERRORES COMUNES

### ❌ Error 1: "Enviando JSON al endpoint de importación"
```json
{
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
}
```
**Problema:** El endpoint espera un archivo CSV, no JSON.

**Solución:** Usa archivo `.csv` con `curl -F "file=@cartones.csv"`

---

### ❌ Error 2: "CSV con formato JSON"
```csv
cardNumber,numbers
14600001,"[2,5,24,39,42,46,51,53,72,86]"
```
**Problema:** Los números están en formato JSON, no separados por espacios.

**Solución:**
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
```

---

### ❌ Error 3: "CSV sin encabezado"
```csv
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
```
**Problema:** Falta la fila `cardNumber,numbers`

**Solución:**
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
```

---

## 📚 REFERENCIAS

- Archivo CSV de ejemplo: `ejemplos-csv/cartones_ejemplo.csv`
- Documentación JSON: `JSON_PAYLOADS_REFERENCIA.md`
- Documentación CSV: `CSV_FORMATO_REFERENCIA.md`
- Importación CSV: `FASE2_CSV_IMPORT.md`

---

## ✅ CONCLUSIÓN

| Cuando... | Usa... | Archivo... |
|---|---|---|
| Crear 1 cartón desde Swagger | JSON | Texto en textarea |
| Crear 1 bingo desde Swagger | JSON | Texto en textarea |
| Importar 100 cartones | CSV | Archivo `.csv` |
| Importar 1000+ cartones | CSV | Archivo `.csv` |

**El CSV NO tiene JSON. Son formatos completamente diferentes usados en contextos diferentes.** ✅
