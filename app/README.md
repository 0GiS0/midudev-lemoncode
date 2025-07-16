# Heroes API - Express.js

Una API REST para gestión de héroes construida con Express.js siguiendo las mejores prácticas.

## 🚀 Características

- **Express.js** - Framework web rápido y minimalista
- **Validación de datos** - Usando express-validator
- **Middleware de seguridad** - Helmet para cabeceras de seguridad
- **CORS** - Configurado para permitir solicitudes cross-origin
- **Logging** - Morgan para logs de peticiones HTTP
- **Compresión** - Gzip para optimizar respuestas
- **Manejo de errores** - Middleware centralizado para errores
- **Estructura modular** - Separación clara de responsabilidades

## 📁 Estructura del proyecto

```
src/
├── controllers/        # Controladores de rutas
├── data/              # Datos mock
├── middleware/        # Middleware personalizado
├── routes/            # Definición de rutas
├── services/          # Lógica de negocio
└── index.js           # Punto de entrada
```

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Copiar archivo de configuración:
```bash
cp .env.example .env
```

3. Iniciar en modo desarrollo:
```bash
npm run dev
```

## 📋 API Endpoints

### Héroes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/heroes` | Obtener todos los héroes |
| GET | `/api/heroes/:id` | Obtener héroe por ID |
| POST | `/api/heroes` | Crear nuevo héroe |
| PUT | `/api/heroes/:id` | Actualizar héroe |
| DELETE | `/api/heroes/:id` | Eliminar héroe |

### Parámetros de consulta para GET /api/heroes

- `page` (number): Número de página (default: 1)
- `limit` (number): Elementos por página (default: 10)
- `search` (string): Buscar por nombre o poder
- `universe` (string): Filtrar por universo

## 📝 Ejemplos de uso

### Obtener todos los héroes
```bash
curl http://localhost:3000/api/heroes
```

### Obtener héroes con filtros
```bash
curl "http://localhost:3000/api/heroes?page=1&limit=5&universe=Marvel"
```

### Crear un nuevo héroe
```bash
curl -X POST http://localhost:3000/api/heroes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Héroe",
    "power": "Súper poder increíble",
    "universe": "Marvel",
    "isActive": true
  }'
```

### Actualizar un héroe
```bash
curl -X PUT http://localhost:3000/api/heroes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spider-Man Actualizado",
    "power": "Poderes arácnidos mejorados"
  }'
```

### Eliminar un héroe
```bash
curl -X DELETE http://localhost:3000/api/heroes/1
```

## 🧪 Testing

Ejecutar tests:
```bash
npm test
```

Ejecutar tests en modo watch:
```bash
npm run test:watch
```

## 📦 Scripts disponibles

- `npm start`: Inicia el servidor en producción
- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm test`: Ejecuta los tests
- `npm run test:watch`: Ejecuta tests en modo watch

## 🔒 Seguridad

- **Helmet**: Configura cabeceras HTTP de seguridad
- **CORS**: Configurado para permitir orígenes específicos
- **Validación**: Validación exhaustiva de entrada de datos
- **Rate limiting**: Preparado para implementar en producción

## � Docker

### Construir imagen
```bash
docker build -t heroes-api .
```

### Ejecutar contenedor
```bash
docker run -p 3000:3000 --env-file .env heroes-api
```

### Usando Docker Compose (recomendado)
```yaml
# docker-compose.yml
version: '3.8'
services:
  heroes-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## �🚀 Producción

Para deployer en producción:

1. Configurar variables de entorno apropiadas
2. Usar un process manager como PM2 o Docker
3. Configurar un reverse proxy (Nginx)
4. Implementar rate limiting
5. Configurar logs persistentes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
