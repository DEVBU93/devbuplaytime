# 🎮 DevBuPlaytime

> Plataforma educativa gamificada con minijuegos, quiz, arena y sistema de progresion completo.

![Stack](https://img.shields.io/badge/Node.js-22-green) ![Stack](https://img.shields.io/badge/React-19-blue) ![Stack](https://img.shields.io/badge/TypeScript-5.3-blue) ![Stack](https://img.shields.io/badge/Prisma-5-purple) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 📁 Estructura del Proyecto

```
devbuplaytime/
├── backend/                 # API REST - Node.js + Express + TypeScript + Prisma
│   ├── prisma/
│   │   └── schema.prisma    # 12 tablas (users, worlds, chapters, missions...)
│   ├── src/
│   │   ├── index.ts         # Entry point - Express + Socket.IO
│   │   ├── routes/          # 11 grupos de rutas (auth, users, worlds...)
│   │   ├── controllers/     # Logica de negocio
│   │   ├── middlewares/     # Auth JWT, errorHandler, validation
│   │   ├── services/        # Servicios por dominio
│   │   ├── socket/          # Socket.IO para Arena en tiempo real
│   │   ├── config/          # Swagger, DB, constants
│   │   └── utils/           # Logger, helpers
│   ├── .env.example         # Variables de entorno
│   └── package.json
├── frontend-web/            # React 19 + Vite + TailwindCSS + Zustand
│   ├── src/
│   │   ├── App.tsx          # Router con 15 rutas
│   │   ├── pages/           # Login, Home, Worlds, Quiz, Arena, Profile, Shop...
│   │   ├── components/      # UI components reutilizables
│   │   ├── layouts/         # MainLayout, AuthLayout
│   │   ├── stores/          # Zustand (auth, game, ui)
│   │   ├── services/        # API calls con Axios
│   │   └── hooks/           # Custom hooks
│   └── package.json
├── mobile-android/          # Android Studio - Kotlin
├── docker-compose.yml       # PostgreSQL 16 + pgAdmin
├── .gitignore
└── README.md
```

---

## 🚀 Setup Rapido

### Prerequisitos
- Node.js >= 20.0.0
- Docker Desktop (para la BD en local)
- VS Code o Visual Studio 2022
- Android Studio (para mobile)

### 1. Clonar el repositorio

```bash
git clone https://github.com/DEVBU93/devbuplaytime.git
cd devbuplaytime
```

### 2. Levantar la Base de Datos (Docker)

```bash
docker-compose up -d
# PostgreSQL en: localhost:5432
# pgAdmin en:    http://localhost:5050
```

### 3. Backend (Visual Studio Code)

```bash
cd backend
cp .env.example .env          # Configura las variables
npm install
npx prisma migrate dev        # Crea las 12 tablas en la BD
npx prisma db seed            # Carga datos de prueba
npm run dev                   # API en http://localhost:3000
# Swagger UI: http://localhost:3000/api-docs
```

### 4. Frontend Web (Visual Studio Code)

```bash
cd frontend-web
npm install
npm run dev                   # App en http://localhost:5173
```

### 5. Mobile (Android Studio)

```
1. Abre Android Studio
2. File > Open > selecciona la carpeta mobile-android/
3. Sync Project with Gradle Files
4. Run app (Shift+F10)
```

---

## 🗄️ Base de Datos - Tablas

| # | Tabla | Descripcion |
|---|-------|-------------|
| 1 | users | Usuarios del sistema |
| 2 | user_profiles | Perfil, nivel, XP, monedas |
| 3 | user_progress | Progreso por mision |
| 4 | worlds | Mundos disponibles |
| 5 | chapters | Capitulos dentro de cada mundo |
| 6 | missions | Misiones dentro de cada capitulo |
| 7 | questions | Preguntas del quiz |
| 8 | quiz_sessions | Sesiones de quiz |
| 9 | arena_sessions | Sesiones Arena multijugador |
| 10 | cosmetics | Items de la tienda |
| 11 | user_cosmetics | Items del usuario |
| 12 | achievements | Logros y badges |

---

## 🌐 API Endpoints (35 endpoints)

| Grupo | Base URL | Endpoints |
|-------|----------|-----------|
| Auth | /api/auth | register, login, logout, refresh, me |
| Users | /api/users | CRUD + profile |
| Worlds | /api/worlds | CRUD + list |
| Chapters | /api/chapters | CRUD + by world |
| Missions | /api/missions | CRUD + by chapter |
| Questions | /api/questions | CRUD + by mission |
| Quiz | /api/quiz | start, answer, finish, history |
| Arena | /api/arena | create-room, join, leaderboard |
| Progress | /api/progress | get, update, stats |
| Cosmetics | /api/cosmetics | list, buy, equip |
| Achievements | /api/achievements | list, unlock, user-achievements |

---

## 🐟 Conectar SQL Server (en lugar de PostgreSQL)

En `backend/.env`:
```
DATABASE_URL="sqlserver://localhost:1433;database=DevBuPlaytime;user=sa;password=TuPassword;encrypt=true;trustServerCertificate=true"
```

En `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```

---

## 🐺 La Manada - DEVBU93

Proyecto desarrollado por La Manada. Parte del ecosistema MOS (Manada OS).
