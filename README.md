# 🧠 Restaurant AI Platform

Una plataforma web inteligente para gestión de restaurantes con asistentes virtuales impulsados por OpenAI. Soporta múltiples sucursales, generación de órdenes, integración con WhatsApp y chat web.

---

## 🚀 Tecnologías

- **Frontend**: Angular + TailwindCSS
- **Backend**: NestJS + Prisma
- **Base de datos**: PostgreSQL
- **Contenedores**: Docker + Docker Compose
- **IA**: OpenAI API
- **Mensajería**: WhatsApp (via Cloud API)
- **QR Generator**: Sharp / QRCode

---

## 📦 Estructura del proyecto

```
restaurant-ai-platform/
├── backend/             # NestJS API
│   ├── src/
│   │   ├── auth/        # Login / Registro
│   │   ├── users/       # Usuarios y roles
│   │   ├── assistants/  # Asistentes OpenAI
│   │   ├── branches/    # Sucursales
│   │   ├── qr/          # Generación de QR
│   │   └── prisma/      # Esquema y servicio
│   ├── public/          # Archivos QR generados
│   ├── assets/          # Logo para QR
│   └── Dockerfile
├── frontend/            # Angular App
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
└── .env
```

---

## 🔐 Roles de usuario

- `ADMIN`: Crea negocios y asigna asistentes
- `CLIENTE`: Gestiona sucursales, productos y asistentes
- `USUARIO`: Interactúa con el asistente (por QR)

---

## ⚙️ Configuración

1. Crea un archivo `.env` en la raíz y en `backend/`:

### `.env` (raíz para Docker)

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret
POSTGRES_DB=ai_restaurants
```

### `backend/.env`

```env
DATABASE_URL=postgresql://postgres:secret@postgres:5432/ai_restaurants
JWT_SECRET=supersecretkey
WEB_CHAT_URL=https://botbite.com.mx/chat
```

---

## 🐳 Docker

### Iniciar el proyecto

```bash
docker compose up --build -d
```

---

## 🛠️ Comandos útiles

### Backend

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### Frontend

```bash
cd frontend
ng build --configuration production
```

---

## 📲 Funcionalidades destacadas

- Registro y login con JWT
- Gestión de sucursales y asistentes
- Generación de QRs personalizados con logo
- Escaneo de QR abre:
  - WhatsApp con el asistente
  - o Chat web propio (según tipo de QR)
- Asignación de asistentes a sucursales
- Validación de acceso a recursos según usuario

---

## 🔁 Comandos por servicio

### Reiniciar un servicio específico

```bash
docker compose restart <servicio>
```

Ejemplos:

```bash
docker compose restart backend
docker compose restart frontend
docker compose restart postgres
```

### Reconstruir y reiniciar un servicio tras cambios

```bash
docker compose up --build -d <servicio>
```

Ejemplos:

```bash
docker compose up --build -d backend
docker compose up --build -d frontend
```

## 📌 Créditos

Desarrollado por Sergio Barreras, utilizando tecnologías modernas y buenas prácticas para arquitecturas escalables basadas en microservicios.

---

## 📄 Licencia

MIT License
