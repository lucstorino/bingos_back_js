# ⚡ QUICK START

## 1️⃣ Instalación Rápida (5 minutos)

### Requisitos
- Node.js v18+
- Docker Desktop
- npm v9+

### Pasos

```bash
# Ya en el directorio bingo-backend

# 1. Verificar que las dependencias están instaladas
npm install

# 2. Levantar PostgreSQL
docker compose up -d

# 3. Esperar a que PostgreSQL esté listo (20 segundos)
# Verificar:
docker compose ps
# Debería mostrar: bingo_postgres (Up)

# 4. Crear base de datos y tablas
npm run prisma:migrate

# 5. Cargar datos de prueba
npm run prisma:seed

# 6. Iniciar el servidor
npm run start:dev
```

## 2️⃣ Verificar que todo funciona

Espera a ver este mensaje en la consola:
```
🚀 Server running on http://localhost:3000
```

Luego prueba en otra terminal:
```bash
curl http://localhost:3000/api/bingos
```

Debería devolver un JSON con los bingos de prueba.

## 3️⃣ Ver datos en Prisma Studio (opcional)

```bash
npm run prisma:studio
```

Se abrirá `http://localhost:5555` con una interfaz visual.

## 4️⃣ Conectar con React Frontend

El frontend debe hacer requests a:
```
http://localhost:3000/api
```

En el frontend, configurar:
```javascript
const API_URL = 'http://localhost:3000/api';
```

## 5️⃣ Detener servicios

```bash
# Detener servidor NestJS
Ctrl + C

# Detener PostgreSQL
docker compose down

# Eliminar todo (volúmenes, contenedores)
docker compose down -v
```

## 📊 Datos de Prueba Creados

Después de `npm run prisma:seed`, disponibles:

### Bingo
- **Nombre:** Bingo Navidad 2026
- **Fecha:** 25/12/2026
- **Precio:** $10.000

### Cartones
- **Cantidad:** 100
- **Números por cartón:** 10 (1-90)
- **Estado:** AVAILABLE

### Premios
- 1° Premio: $5.000.000
- 2° Premio: $1.500.000
- 3° Premio: $750.000
- 4° Premio: $250.000
- 5° Premio: $100.000

### Clientes
- Juan Pérez
- María González
- Carlos López

## 🧪 Probar Endpoints (con curl o Postman)

```bash
# Listar bingos
curl http://localhost:3000/api/bingos

# Listar cartones disponibles (página 1, 50 por página)
curl http://localhost:3000/api/bingos/{bingoId}/cards?page=1&limit=50&status=AVAILABLE

# Obtener un cartón
curl http://localhost:3000/api/cards/{cardId}
```

## 🆘 Solucionar Problemas

### Error: "Cannot connect to PostgreSQL"
```bash
# Verificar que Docker está corriendo
docker ps

# Si no aparece bingo_postgres, levantar nuevamente
docker compose up -d

# Ver logs
docker compose logs postgres
```

### Error: "Prisma migrations failed"
```bash
# Resetear base de datos (⚠️ BORRA TODOS LOS DATOS)
npx prisma migrate reset

# O migrar manualmente
npx prisma migrate dev
```

### Error: "npm run prisma:seed failed"
```bash
# Verificar que PostgreSQL está corriendo
docker compose ps

# Ejecutar seed nuevamente
npm run prisma:seed
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso que usa puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## ✅ Checklist de Verificación

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Docker instalado (`docker --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] PostgreSQL levantado (`docker compose ps`)
- [ ] Migraciones ejecutadas (`npm run prisma:migrate`)
- [ ] Seed ejecutado (`npm run prisma:seed`)
- [ ] Servidor iniciado (`npm run start:dev`)
- [ ] Backend accesible (`curl http://localhost:3000/api/bingos`)
- [ ] Frontend configurado para `http://localhost:3000/api`

## 📌 Estructura de Directorios

```
bingo-backend/
├── src/                    # Código fuente
│   ├── main.ts            # Punto de entrada
│   ├── app.module.ts      # Módulo raíz
│   ├── config/            # Configuración
│   ├── prisma/            # BD
│   ├── bingos/            # [Por implementar]
│   ├── cards/             # [Por implementar]
│   └── ...
├── prisma/
│   ├── schema.prisma      # Schema
│   └── seed.ts            # Datos iniciales
├── dist/                  # Código compilado
├── docker-compose.yml     # PostgreSQL
├── package.json
├── .env                   # Config local
├── README.md
├── FASES.md              # Roadmap
└── QUICK-START.md        # Este archivo
```

## 🔄 Flujo de Desarrollo

1. Trabajar en rama feature
2. Implementar cambios
3. Compilar: `npm run build`
4. Probar: `npm run start:dev`
5. Tests: `npm run test`
6. Commit: `git commit -m "..."`
7. Push: `git push origin feature/...`
8. Pull Request

## 📖 Documentación Adicional

- [README.md](./README.md) - Documentación completa
- [FASES.md](./FASES.md) - Roadmap de implementación
- [prisma/schema.prisma](./prisma/schema.prisma) - Schema de BD
- [.env.example](./.env.example) - Variables de entorno

---

**¡Listo para comenzar! 🚀**

Si algo no funciona, verifica la sección "Solucionar Problemas" arriba.
