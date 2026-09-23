# 📋 FASE 2: Importación Masiva de Cartones (CSV)

## ✅ Implementado

### Archivos Creados:
1. **src/cards/csv-import.service.ts** - Servicio de importación
2. **src/cards/dto/import-cards.dto.ts** - DTOs para respuesta
3. **ejemplos-csv/cartones_ejemplo.csv** - Archivo de ejemplo

### Servicios Actualizados:
- **src/cards/cards.module.ts** - Se agregó CardsImportService

### Controladores Actualizados:
- **src/bingos/bingos.controller.ts** - Nuevo endpoint POST

---

## 🎯 Endpoint Implementado

```
POST /api/bingos/:bingoId/cards/import
Content-Type: multipart/form-data
```

**Parámetro:** `file` (archivo CSV)

**Response:**
```json
{
  "total": 10,
  "imported": 9,
  "failed": 1,
  "errors": [
    {
      "row": 5,
      "cardNumber": "14600005",
      "error": "El cartón ya existe en este bingo"
    }
  ],
  "importedAt": "2024-03-15T10:30:00Z"
}
```

---

## 📄 Formato del CSV

### Columnas Requeridas:
- **cardNumber**: Identificador único del cartón (string)
- **numbers**: 10 números separados por espacio o coma (string)

### Ejemplos de Formato:

#### Formato 1: Números separados por espacios
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
```

#### Formato 2: Números separados por comas
```csv
cardNumber,numbers
14600001,2,5,24,39,42,46,51,53,72,86
14600002,1,8,15,28,35,44,52,61,75,88
```

---

## ✅ Validaciones Implementadas

### Por Cartón:
- ✅ Exactamente 10 números
- ✅ Números entre 1 y 90
- ✅ Sin números duplicados en el cartón
- ✅ Sin cartones duplicados en el bingo

### Por Archivo:
- ✅ Formato CSV válido
- ✅ Columnas requeridas presentes
- ✅ Manejo robusto de errores

### Por Procesamiento:
- ✅ Transacciones por lotes de 1000 registros
- ✅ Soporte para ~20,000 registros
- ✅ Reporta errores sin detener importación
- ✅ Devuelve cantidad importada vs fallida

---

## 🧪 Testing Manual

### 1. Crear un Bingo:
```bash
POST /api/bingos
Content-Type: application/json

{
  "name": "Bingo Prueba CSV",
  "description": "Bingo para probar importación",
  "drawDate": "2024-03-15T20:00:00Z",
  "price": 100.00,
  "status": "DRAFT"
}

# Response: { "id": "cmubycgc900028liz9uih26m3", ... }
```

### 2. Importar Cartones:
```bash
POST /api/bingos/cmubycgc900028liz9uih26m3/cards/import
Content-Type: multipart/form-data

# Adjuntar archivo: cartones_ejemplo.csv
```

### 3. Verificar Importación:
```bash
GET /api/bingos/cmubycgc900028liz9uih26m3/cards?page=1&limit=10
```

---

## 🔍 Formatos CSV Soportados

✅ **Separador de números:** espacio o coma
✅ **Límites de números:** 1-90
✅ **Cantidad de números:** exactamente 10
✅ **Tamaño de archivo:** soporta hasta ~20,000 cartones
✅ **Transacciones:** por lotes de 1000

---

## 📊 Performance

- **Procesamiento:** Lotes de 1000 registros por transacción
- **Tiempo estimado:** ~5-10 segundos para 10,000 cartones
- **Manejo de errores:** Continúa aunque fallen algunos registros
- **Rollback:** Solo el lote fallido se revierte, no toda la importación

---

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Archivo CSV requerido" | No se adjuntó archivo | Adjuntar archivo en el campo `file` |
| "El archivo debe ser CSV" | Formato incorrecto | Usar extensión `.csv` |
| "Bingo con ID ... no encontrado" | ID de bingo inválido | Verificar que el bingo existe |
| "El cartón debe tener exactamente 10 números" | Cantidad incorrecta | Asegurar 10 números por fila |
| "Los números deben estar entre 1 y 90" | Números fuera de rango | Usar solo números 1-90 |
| "El cartón no puede tener números duplicados" | Números repetidos | Asegurar números únicos |
| "El cartón ya existe en este bingo" | Cartón duplicado | Usar cardNumber único |

---

## 📝 Próximos Pasos

La **FASE 2** está completa. 

Próxima: **FASE 3 - Clientes, Reservas y Órdenes**
