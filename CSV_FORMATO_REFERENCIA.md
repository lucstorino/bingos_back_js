# 📋 Formato CSV para Importación de Cartones

## 📄 Estructura Requerida

El archivo CSV debe tener exactamente **2 columnas**:

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `cardNumber` | string | Identificador único del cartón | `14600001` |
| `numbers` | string | 10 números separados por espacio o coma | `2 5 24 39 42 46 51 53 72 86` |

---

## ✅ Ejemplo 1: Números Separados por ESPACIOS (Recomendado)

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

---

## ✅ Ejemplo 2: Números Separados por COMAS

```csv
cardNumber,numbers
14600001,2,5,24,39,42,46,51,53,72,86
14600002,1,8,15,28,35,44,52,61,75,88
14600003,3,12,19,33,40,48,55,67,79,85
14600004,7,14,21,30,37,47,58,66,71,84
14600005,6,13,22,31,39,49,56,64,73,87
14600006,4,11,20,29,38,45,54,62,78,89
14600007,5,16,23,32,41,50,57,68,76,90
14600008,9,17,24,34,43,51,59,69,77,81
14600009,10,18,25,36,42,52,60,70,80,82
14600010,2,15,26,38,44,53,61,72,74,83
```

---

## ❌ Ejemplos INVÁLIDOS

### ❌ Mal 1: Números fuera de rango
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 95
              ↑ ERROR: 95 está fuera del rango 1-90
```

### ❌ Mal 2: Números duplicados
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72 2
              ↑ ERROR: 2 aparece dos veces
```

### ❌ Mal 3: Cantidad incorrecta
```csv
cardNumber,numbers
14600001,2 5 24 39 42 46 51 53 72
         ↑ ERROR: Solo 9 números, se necesitan 10
```

### ❌ Mal 4: Formato incorrecto
```csv
cardNumber,numbers
14600001,2-5-24-39-42-46-51-53-72-86
              ↑ ERROR: Usar espacio o coma, no guion
```

---

## 📋 Validaciones Implementadas

✅ **Exactamente 10 números por cartón**
- Menos de 10: ❌ Error
- Más de 10: ❌ Error
- Exactamente 10: ✅ Válido

✅ **Números entre 1 y 90**
- Número 0: ❌ Error
- Número 91: ❌ Error
- Números 1-90: ✅ Válido

✅ **Sin números duplicados**
- `1 2 3 4 5 6 7 8 9 1`: ❌ Error (1 repetido)
- `1 2 3 4 5 6 7 8 9 10`: ✅ Válido

✅ **Sin cartones duplicados por bingo**
- Si intenta importar el mismo `cardNumber` dos veces: ❌ Error en la segunda
- `cardNumber` único en el bingo: ✅ Válido

✅ **Columnas requeridas**
- Falta `cardNumber`: ❌ Error
- Falta `numbers`: ❌ Error
- Ambas presentes: ✅ Válido

---

## 🧪 Response de Importación

### Respuesta exitosa:
```json
{
  "total": 100,
  "imported": 100,
  "failed": 0,
  "errors": [],
  "importedAt": "2024-03-15T10:30:00.123Z"
}
```

### Respuesta con errores:
```json
{
  "total": 10,
  "imported": 8,
  "failed": 2,
  "errors": [
    {
      "row": 5,
      "cardNumber": "14600005",
      "error": "El cartón debe tener exactamente 10 números, se encontraron 9"
    },
    {
      "row": 7,
      "cardNumber": "14600007",
      "error": "El cartón no puede tener números duplicados"
    }
  ],
  "importedAt": "2024-03-15T10:30:00.123Z"
}
```

---

## 💡 Consejos

1. **Usa espacios** como separador de números (más legible)
2. **Verifica el archivo** con un editor de texto antes de importar
3. **Asegúrate de que las columnas** estén exactamente como se muestra
4. **Sin espacios extras** alrededor de los números
5. **Codificación UTF-8** (estándar en Excel y Google Sheets)

---

## 🚀 Cómo Usar

### Opción 1: Usando Swagger
1. Abre `http://localhost:3000/api/docs`
2. Busca `POST /api/bingos/{bingoId}/cards/import`
3. Haz clic en "Try it out"
4. Ingresa el `bingoId`
5. Selecciona tu archivo CSV
6. Haz clic en "Execute"

### Opción 2: Usando curl
```bash
curl -X POST http://localhost:3000/api/bingos/{bingoId}/cards/import \
  -F "file=@cartones.csv"
```

### Opción 3: Usando PowerShell
```powershell
$csvPath = "C:\ruta\a\cartones.csv"
$bingoId = "tu-bingo-id"
$uri = "http://localhost:3000/api/bingos/$bingoId/cards/import"

$form = @{
    file = Get-Item -Path $csvPath
}

Invoke-WebRequest -Uri $uri -Method Post -Form $form
```

---

## 📊 Archivo de Ejemplo

El proyecto incluye un archivo de ejemplo en:
```
ejemplos-csv/cartones_ejemplo.csv
```

Puedes usarlo como referencia para crear tus propios archivos.

---

## ✅ Checklist Antes de Importar

- [ ] CSV tiene exactamente 2 columnas: `cardNumber` y `numbers`
- [ ] Cada cartón tiene exactamente 10 números
- [ ] Los números están entre 1 y 90
- [ ] No hay números duplicados en cada cartón
- [ ] No hay cartones duplicados (números únicos por bingo)
- [ ] El separador es espacio o coma (no guiones o puntos)
- [ ] El archivo está codificado en UTF-8
- [ ] El bingo existe (tienes un bingoId válido)
