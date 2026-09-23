# ⚡ REFERENCIA RÁPIDA - CSV vs JSON

## 🎯 La Pregunta
> "¿Cuál es el ejemplo que debe tener de JSON el CSV?"

## ✅ La Respuesta
**CSV NO es JSON.** Son dos formatos completamente diferentes.

---

## 📊 COMPARACIÓN EN 30 SEGUNDOS

```
CREAR 1 CARTÓN (JSON)          |  IMPORTAR 100 CARTONES (CSV)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST /api/bingos/...           |  POST /api/bingos/.../import
     /cards                    |       /cards
                               |
Endpoint: individual           |  Endpoint: masivo
Content-Type: json             |  Content-Type: multipart/form-data
Body: JSON en textarea         |  Body: archivo CSV
                               |
{                              |  cardNumber,numbers
  "cardNumber": "14600001",   |  14600001,2 5 24 39 42 46 51 53 72 86
  "numbers": [2, 5, 24, ...]  |  14600002,1 8 15 28 35 44 52 61 75 88
}                              |  14600003,3 12 19 33 40 48 55 67 79 85
                               |
Response:                      |  Response:
{                              |  {
  "id": "...",                |    "total": 3,
  "cardNumber": "14600001",   |    "imported": 3,
  "numbers": [...]            |    "failed": 0,
}                              |    "errors": []
                               |  }
```

---

## 🔍 TABLA COMPARATIVA

| Aspecto | JSON | CSV |
|---------|------|-----|
| **Tipo** | Estructura | Archivo texto |
| **Extensión** | `.json` | `.csv` |
| **Para** | 1 cartón | 100+ cartones |
| **UI Swagger** | textarea | file upload |
| **Contenido** | 1 objeto | Múltiples filas |
| **Ejemplo** | `{"cardNumber":"14600001"}` | `14600001,2 5 24 39...` |
| **Validación** | Por registro | Por lote |

---

## ✅ VALIDACIONES CSV AUTOMÁTICAS

✅ Exactamente 10 números
✅ Números entre 1 y 90
✅ Sin números duplicados
✅ 2 columnas: cardNumber, numbers
✅ Encabezado requerido

---

## 📋 EJEMPLO CSV

```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 86
14600002,1 8 15 28 35 44 52 61 75 88
14600003,3 12 19 33 40 48 55 67 79 85
```

---

## 💡 EJEMPLOS JSON

### Crear Bingo
```json
{
  "name": "Mi Bingo",
  "description": "Descripción",
  "drawDate": "2026-12-25T00:00:00Z",
  "price": 5000
}
```

### Crear Cartón
```json
{
  "cardNumber": "14600001",
  "numbers": [2, 5, 24, 39, 42, 46, 51, 53, 72, 86]
}
```

### Response Importación CSV
```json
{
  "total": 10,
  "imported": 10,
  "failed": 0,
  "errors": []
}
```

---

## 🚀 COMANDOS RÁPIDOS

**Levantar backend:**
```bash
npm run start:dev
```

**Ver base de datos:**
```bash
npm run prisma:studio
```

**Importar CSV (curl):**
```bash
curl -X POST http://localhost:3000/api/bingos/{bingoId}/cards/import \
  -F "file=@cartones.csv"
```

---

## 📍 URLS

| Servicio | URL |
|----------|-----|
| Backend | http://localhost:3000 |
| Swagger | http://localhost:3000/api/docs |
| Prisma Studio | http://localhost:5555 |

---

## 📚 DOCUMENTACIÓN

| Archivo | Para... |
|---------|---------|
| COMIENZA_AQUI.md | Respuesta rápida |
| COMPARACION_VISUAL_CSV_JSON.md | Ver diferencias |
| GUIA_CSV_COMPLETA.md | Aprender todo |
| JSON_PAYLOADS_REFERENCIA.md | Ejemplos JSON |

---

## ❌ ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| CSV no se importa | Formato incorrecto | Verifica: 10 números, rango 1-90 |
| Swagger muestra solo JSON | Endpoint mal configurado | Reinicia: npm run start:dev |
| BD vacía | Migraciones no ejecutadas | Ejecuta: npm run prisma:seed |
| Número duplicado error | CSV con duplicados | Verifica números únicos |

---

## ✅ ESTADO DEL PROYECTO

- ✅ FASE 1: Infraestructura BD + ABM
- ✅ FASE 2: Importación CSV masiva
- ⏳ FASE 3: Órdenes y Clientes
- ⏳ FASE 4: Premios y Ganadores
- ⏳ FASE 5: Frontend

---

**¡Listo para usar!** 🚀
