# 🐳 Guía de Docker Compose para Heroes API

Esta guía te ayudará a ejecutar la Heroes API junto con MongoDB usando Docker Compose.

## 📋 Servicios incluidos

### 🚀 **heroes-api**
- API REST construida con Express.js
- Puerto: `3000`
- Variables de entorno configuradas para MongoDB

### 🍃 **mongo**
- MongoDB 7.x
- Puerto: `27017`
- Base de datos: `heroes_db`
- Usuario: `heroes_user`
- Persistencia de datos con volúmenes

### 🌐 **mongo-express**
- Interfaz web para administrar MongoDB
- Puerto: `8081`
- Usuario: `admin` / Contraseña: `admin`

## 🚀 Inicio rápido

### 1. Construir y ejecutar todos los servicios
```bash
docker-compose up -d
```

### 2. Ver logs de los servicios
```bash
# Todos los servicios
docker-compose logs -f

# Solo la API
docker-compose logs -f heroes-api

# Solo MongoDB
docker-compose logs -f mongo
```

### 3. Verificar que todo esté funcionando
```bash
# Estado de la API
curl http://localhost:3000/health

# Listar héroes
curl http://localhost:3000/api/heroes
```

## 🔧 Comandos útiles

### Gestión de servicios
```bash
# Iniciar servicios
docker-compose up -d

# Parar servicios
docker-compose down

# Parar servicios y eliminar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache

# Reiniciar un servicio específico
docker-compose restart heroes-api
```

### Acceso a contenedores
```bash
# Ejecutar comando en el contenedor de la API
docker-compose exec heroes-api sh

# Ejecutar comando en MongoDB
docker-compose exec mongo mongosh
```

### Logs y monitoreo
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de los últimos 100 líneas
docker-compose logs --tail=100

# Ver estadísticas de recursos
docker-compose stats
```

## 🌐 URLs de acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| API REST | http://localhost:3000 | Endpoint principal de la API |
| Health Check | http://localhost:3000/health | Estado de la aplicación y BD |
| Heroes API | http://localhost:3000/api/heroes | Endpoints de héroes |
| Mongo Express | http://localhost:8081 | Interfaz web de MongoDB |
| MongoDB | mongodb://localhost:27017 | Conexión directa a MongoDB |

## 📊 Credenciales

### MongoDB
- **Admin Usuario**: `admin`
- **Admin Contraseña**: `admin_password`
- **App Usuario**: `heroes_user`
- **App Contraseña**: `heroes_password`
- **Base de datos**: `heroes_db`

### Mongo Express
- **Usuario**: `admin`
- **Contraseña**: `admin`

## 🔍 Verificación paso a paso

### 1. Verificar que los contenedores estén corriendo
```bash
docker-compose ps
```

### 2. Probar la conexión a la API
```bash
curl -s http://localhost:3000/health | jq
```

### 3. Probar endpoints de héroes
```bash
# Listar héroes
curl -s http://localhost:3000/api/heroes | jq

# Crear un héroe
curl -X POST http://localhost:3000/api/heroes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Héroe",
    "power": "Poder increíble",
    "universe": "Marvel"
  }' | jq
```

### 4. Acceder a Mongo Express
Abre http://localhost:8081 en tu navegador y usa las credenciales `admin:admin`.

## 🛠️ Desarrollo

### Variables de entorno
Las variables están configuradas en el `compose.yml`. Para desarrollo local, crea un archivo `.env`:

```bash
cp .env.example .env
```

### Desarrollo con hot reload
Para desarrollo, puedes montar el código como volumen:

```yaml
# Añadir a heroes-api en compose.yml
volumes:
  - .:/usr/src/app
  - /usr/src/app/node_modules
```

## 🚨 Solución de problemas

### La API no puede conectar a MongoDB
```bash
# Verificar que MongoDB esté corriendo
docker-compose logs mongo

# Reiniciar servicios en orden
docker-compose down
docker-compose up -d mongo
docker-compose up -d heroes-api
```

### Puerto ya en uso
```bash
# Cambiar puertos en compose.yml
ports:
  - "3001:3000"  # API en puerto 3001
  - "27018:27017"  # MongoDB en puerto 27018
```

### Limpiar datos de MongoDB
```bash
# Eliminar volumen de datos
docker-compose down -v
docker-compose up -d
```

## 📈 Monitoreo

### Ver estadísticas de recursos
```bash
docker-compose stats
```

### Verificar salud de los servicios
```bash
# Estado de la API
curl http://localhost:3000/health

# Estado de MongoDB desde Mongo Express
# Ir a http://localhost:8081
```

## 🎯 Siguientes pasos

1. **Configurar reverse proxy** (Nginx/Traefik)
2. **Añadir Redis** para caché
3. **Configurar backups** de MongoDB
4. **Implementar secrets** para credenciales
5. **Añadir monitoring** (Prometheus/Grafana)
