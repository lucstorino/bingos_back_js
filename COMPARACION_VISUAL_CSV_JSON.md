# 📸 COMPARACIÓN VISUAL: CSV vs JSON en Swagger

## 🎯 TU PREGUNTA RESPONDIDA CON IMÁGENES

> "En Swagger no me deja pedir archivo, solo está la opción de json. ¿Cuál es el ejemplo que debe tener de JSON el CSV?"

---

## 📋 VISUALIZACIÓN 1: JSON (Crear 1 Cartón)

### Endpoint en Swagger
```
POST /api/bingos/{bingoId}/cards
Crear un cartón en un bingo
```

### Request Body Type
```
[dropdown: application/json]
```

### UI en Swagger
```
┌─────────────────────────────────────────────────┐
│ Request body                           required  │
│ [dropdown: application/json]            ────────┐
│                                                  │
│ Example Value | Schema                          │
│                                                  │
│ {                                               │
│   "cardNumber": "14600001",                     │
│   "numbers": [2, 5, 24, 39, 42, 46,            │
│               51, 53, 72, 86]                   │
│ }                                               │
│                                                  │
│ [Click: Copy] [Click: Try it out]               │
└─────────────────────────────────────────────────┘
```

### ¿Qué es?
- ✅ JSON en **textarea**
- ✅ Puedes copiar/pegar
- ✅ Puedes editar
- ✅ Estructura de objeto

### Response Esperado
```json
{
  "id": "cmudeenkz0003dvl652055tq6",
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86],
  "status": "AVAILABLE"
}
```

---

## 📁 VISUALIZACIÓN 2: CSV (Importar Muchos Cartones)

### Endpoint en Swagger
```
POST /api/bingos/{bingoId}/cards/import
Importar cartones desde CSV
```

### Request Body Type
```
[dropdown: multipart/form-data]
```

### UI en Swagger
```
┌──────────────────────────────────────────────────┐
│ Request body                           required   │
│ [dropdown: multipart/form-data]         ────────┐│
│                                                   ││
│ file * required                                   ││
│ string($binary)                                   ││
│                                                   ││
│ Archivo CSV con cartones                         ││
│ (columnas: cardNumber, numbers)                   ││
│                                                   ││
│ [Choose File] ejemplos-csv/cartones_ejemplo.csv   ││
│                                                   ││
│ [Click: Try it out] [Click: Cancel]              ││
└──────────────────────────────────────────────────┘│
```

### ¿Qué es?
- ✅ Archivo de texto plano (`.csv`)
- ✅ Selector de archivo (file browser)
- ✅ NO es JSON, es un archivo
- ✅ Contiene múltiples cartones

### Contenido del Archivo CSV
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

### Response Esperado
```json
{
  "total": 10,
  "imported": 10,
  "failed": 0,
  "errors": [],
  "importedAt": "2026-09-23T01:02:18.899Z"
}
```

---

## 🔄 LADO A LADO: DIFERENCIA VISUAL

```
┌─────────────────────────┬──────────────────────────┐
│         JSON            │          CSV             │
├─────────────────────────┼──────────────────────────┤
│ PARA 1 CARTÓN           │ PARA 100+ CARTONES       │
│                         │                          │
│ POST /api/bingos/...    │ POST /api/bingos/...     │
│        /cards           │        /cards/import     │
│                         │                          │
│ Content-Type:           │ Content-Type:            │
│ application/json        │ multipart/form-data      │
│                         │                          │
│ UI en Swagger:          │ UI en Swagger:           │
│ [textarea]              │ [file upload button]     │
│ {                       │ [Choose File] cartones.  │
│   "cardNumber": "...",  │              csv         │
│   "numbers": [...]      │                          │
│ }                       │ cardNumber,numbers       │
│                         │ 14600001,2 5 24 39 ...   │
│ Validaciones:           │ 14600002,1 8 15 28 ...   │
│ Por registro            │ 14600003,3 12 19 33 ...  │
│                         │                          │
│ Inserción:              │ Inserción:               │
│ 1 a la vez              │ Lotes de 1000            │
│                         │                          │
│ Error:                  │ Error:                   │
│ Falla en registro       │ Continúa, reporta al fin │
└─────────────────────────┴──────────────────────────┘
```

---

## 📊 TABLA COMPARATIVA VISUAL

| Concepto | JSON | CSV |
|----------|------|-----|
| **Formato** | `{ "key": value }` | Texto plano |
| **Archivo** | `.json` | `.csv` |
| **Extensión** | Estructura | Tabular |
| **En Swagger UI** | Textarea | File Upload |
| **Contenido** | 1 objeto | Múltiples filas |
| **Ejemplo** | `{"cardNumber":"..."}` | `cardNumber,numbers` |
| **Para** | Crear 1 cartón | Importar 100 cartones |
| **Caracteres** | `{ } [ ] : "` | `,` (solo comas) |
| **Validaciones** | Por registro | Por lote |
| **Tamaño** | Grande | Pequeño |
| **Compatible Excel** | ❌ No | ✅ Sí |
| **Compatible Google Sheets** | ❌ No | ✅ Sí |

---

## 🎬 PASOS EN SWAGGER

### PASO 1: JSON (Crear 1 Cartón)

```
1. Ve a POST /api/bingos/{bingoId}/cards
   │
2. Haz clic en "Try it out"
   │
3. Ingresa el bingoId
   │
4. En "Request body" ves un TEXTAREA con JSON:
   │
   ┌────────────────────────────┐
   │ {                          │
   │   "cardNumber": "14600001",│
   │   "numbers": [2, 5, 24,... │
   │ }                          │
   └────────────────────────────┘
   │
5. Edita el JSON según necesites
   │
6. Haz clic en "Execute"
   │
7. Response en JSON
```

---

### PASO 2: CSV (Importar Muchos Cartones)

```
1. Ve a POST /api/bingos/{bingoId}/cards/import
   │
2. Haz clic en "Try it out"
   │
3. Ingresa el bingoId
   │
4. En "Request body" ves un BOTÓN DE ARCHIVO:
   │
   ┌──────────────────────────┐
   │ [Choose File] cartones.  │
   │              csv         │
   └──────────────────────────┘
   │
5. Selecciona tu archivo CSV (ejemplos-csv/cartones_ejemplo.csv)
   │
6. Haz clic en "Execute"
   │
7. Response en JSON con reporte
```

---

## 🎨 COMPARACIÓN VISUAL DEL CONTENIDO

### JSON (Lo que ENVÍAS)
```
┌─────────────────────────────────────┐
│                                     │
│  ES UN OBJETO ESTRUCTURADO          │
│                                     │
│  {                                  │
│    "cardNumber": "14600001",       │
│    "numbers": [                     │
│      2, 5, 24, 39, 42,             │
│      46, 51, 53, 72, 86            │
│    ]                                │
│  }                                  │
│                                     │
│  Características:                   │
│  ✓ Tiene { }                        │
│  ✓ Tiene [ ]                        │
│  ✓ Tiene comillas "                 │
│  ✓ Tiene dos puntos :               │
│  ✓ Estructura clara                 │
│                                     │
└─────────────────────────────────────┘
```

### CSV (Lo que ENVÍAS)
```
┌──────────────────────────────────────┐
│                                      │
│  ES UN ARCHIVO DE TEXTO PLANO       │
│                                      │
│  cardNumber,numbers                  │
│  14600001,2 5 24 39 42 46 51 53 72 86│
│  14600002,1 8 15 28 35 44 52 61 75 88│
│  14600003,3 12 19 33 40 48 55 67 79 85
│  14600004,7 14 21 30 37 47 58 66 71 84│
│  14600005,6 13 22 31 39 49 56 64 73 87│
│  14600006,4 11 20 29 38 45 54 62 78 89│
│  14600007,5 16 23 32 41 50 57 68 76 90│
│  14600008,9 17 24 34 43 51 59 69 77 81│
│  14600009,10 18 25 36 42 52 60 70 80 82
│  14600010,2 15 26 38 44 53 61 72 74 83│
│                                      │
│  Características:                    │
│  ✓ Filas y columnas                  │
│  ✓ Texto plano                       │
│  ✓ Separado por comas y espacios     │
│  ✓ Excel lo entiende                 │
│  ✓ Legible a simple vista            │
│                                      │
└──────────────────────────────────────┘
```

---

## 🔍 EN DETALLE: ¿POR QUÉ?

### Por qué JSON para 1 cartón?
```
1 cartón = 1 operación
Usar JSON permite:
✓ Enviar estructura compleja
✓ Validar antes de enviar
✓ Respuesta con detalles
✓ Fácil de debuggear

JSON: {"cardNumber": "14600001", "numbers": [...]}
      ↑ Objeto único
      Fácil de procesar
```

### Por qué CSV para muchos cartones?
```
100 cartones = 100 operaciones
Usar CSV permite:
✓ Archivo más pequeño
✓ Importación rápida
✓ Compatible Excel
✓ Procesamiento en lotes

CSV: cardNumber,numbers
     14600001,2 5 24 39...
     14600002,1 8 15 28...
     ...
     ↑ Múltiples filas
     Procesamiento eficiente
```

---

## ✅ PRUEBA EN VIVO

### Lo que vimos funcionar:

#### JSON (Crear Bingo)
```bash
✅ POST /api/bingos
✅ Content-Type: application/json
✅ Body: {"name":"Bingo CSV Test 20260922_220146",...}
✅ Response: {"id":"cmudedyhv0000dvl6r0nzj7lq",...}
```

#### CSV (Importar Cartones)
```bash
✅ POST /api/bingos/cmudedyhv0000dvl6r0nzj7lq/cards/import
✅ Content-Type: multipart/form-data
✅ File: ejemplos-csv/cartones_ejemplo.csv
✅ Response: {"total":10,"imported":10,"failed":0,"errors":[]}
```

#### JSON (Listar Cartones)
```bash
✅ GET /api/bingos/cmudedyhv0000dvl6r0nzj7lq/cards
✅ Response: {"data":[...],"meta":{"total":10}}
```

---

## 🎉 CONCLUSIÓN VISUAL

### La Diferencia Clave

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  CUANDO SWAGGER MUESTRA...                      │
│                                                 │
│  [textarea con JSON]    →   Crear 1 registro  │
│  [botón file upload]    →   Importar N registros│
│                                                 │
│  NO ES "una es JSON y otra no"                  │
│  ES "los dos formatos se usan en contextos     │
│  diferentes"                                    │
│                                                 │
│  JSON = Para operaciones individuales           │
│  CSV  = Para operaciones masivas                │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tu Pregunta, Respondida Visualmente

```
"¿Cuál es el ejemplo que debe tener de JSON el CSV?"

┌────────────────────────────────────────┐
│ CSV NO TIENE JSON                      │
│ CSV ES UN FORMATO DE TEXTO PLANO       │
│                                        │
│ JSON es la RESPUESTA del server        │
│ CSV es el CONTENIDO del archivo        │
│                                        │
│ JSON:                                  │
│ {"cardNumber":"14600001","numbers":[]} │
│                                        │
│ CSV:                                   │
│ cardNumber,numbers                     │
│ 14600001,2 5 24 39 42 46 51 53 72 86 │
│                                        │
│ ¡Ambos funcionan en el proyecto! ✅   │
└────────────────────────────────────────┘
```

---

## 📞 REFERENCIAS

Para más detalles visuales, ver:
- **COMIENZA_AQUI.md** - Guía visual rápida
- **GUIA_CSV_COMPLETA.md** - Guía con ejemplos
- **CSV_VS_JSON_VISUAL.md** - Comparación lado a lado
- **ESTADO_FINAL_PROYECTO.md** - Resumen completo
