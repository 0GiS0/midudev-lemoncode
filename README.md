# 🚀 Mis demos en el Twitch de Midudev 🤓

¡Hola developer! 👋🏻 En este repo encontrarás todas las demos que te mostré durante mi Twitch con Midudev. Prepárate para aprender sobre contenedores y Docker de forma práctica y divertida. 🐳✨


## 🗓️ Agenda

- [🤔 ¿Por qué me interesa aprender contenedores?](#-por-qué-me-interesa-aprender-contenedores)
- [🐳 ¿Qué es Docker?](#-qué-es-docker)
- [🔰 ¿Por dónde empiezo? > Docker Desktop](#-por-dónde-empiezo--docker-desktop)
- [🛠️ Mi primer contenedor](#🛠️-mi-primer-contenedor)
- [🌐 Cómo accedo a él desde el exterior](#-cómo-accedo-a-él-desde-el-exterior)
- [📦 Cómo creo un contenedor de mi aplicación](#-cómo-creo-un-contenedor-de-mi-aplicación)
- [🗄️ Un contenedor de una base de datos](#-un-contenedor-de-una-base-de-datos)
- [💾 Y cómo guardo los datos](#-y-cómo-guardo-los-datos)
- [🔗 Cómo conecto varios contenedores](#-cómo-conecto-varios-contenedores)
- [🧩 Docker Compose](#-docker-compose)
- [✨ Otros usos](#-otros-usos)
    - [💻 Dev Containers](#dev-containers)
    - [🤖 IA > Docker Model Runner](#ia--docker-model-runner)
    - [🧠 MCP Servers](#mcp-servers)

---

### 🤔 ¿Por qué me interesa aprender contenedores?

¿Te suena el típico "en mi máquina funciona"? 😅 Los contenedores son la solución para asegurarte de que tu aplicación funcione igual en cualquier entorno: desarrollo, producción o testing. Incluyen todo lo necesario para ejecutarla (código, dependencias, librerías, etc.), evitando problemas de compatibilidad y haciendo tu vida como developer mucho más fácil. ¡No te lo pierdas! 🚀

---

### 🐳 ¿Qué es Docker?

Docker es tanto una empresa como un software. Cuando hablamos de Docker, nos referimos a una plataforma que facilita crear, desplegar y ejecutar aplicaciones en contenedores. Ganó popularidad porque simplificó muchísimo el trabajo con contenedores para los desarrolladores. ¡Un must en tu toolbox! 🧰

---

### 🔰 ¿Por dónde empiezo? > Docker Desktop

Lo más sencillo para empezar es instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/). Es una app gráfica para gestionar tus contenedores fácilmente. Una vez instalada, verás el icono de Docker 🐳 en tu barra de tareas y podrás crear, iniciar, detener y eliminar contenedores, además de ver logs y estadísticas.

Aunque la interfaz gráfica es útil, te recomiendo aprender la línea de comandos 💻, ya que es más potente y flexible. Docker Desktop incluye un terminal integrado listo para usar. ¡No hay excusas! 😉

---

### 🛠️ Mi primer contenedor

Con Docker Desktop instalado, ¡vamos a crear nuestro primer contenedor! Usaremos la imagen oficial de Nginx (un servidor web muy popular). Abre el terminal integrado y ejecuta:

```bash
docker run nginx
```

Esto descargará la imagen de Nginx (si no la tienes) y creará un contenedor. Verás los logs en el terminal indicando que Nginx está funcionando. Pero aún no podrás acceder desde el navegador... ¡Vamos a solucionarlo! 🌐

---

### 🌐 Cómo accedo a él desde el exterior

Para acceder a Nginx desde tu navegador, necesitas exponer el puerto del contenedor al de tu máquina. Usa la opción `-p`:

```bash
docker run -p 8080:80 nginx
```

Ahora sí, abre tu navegador en `http://localhost:8080` y verás Nginx funcionando. ¡Genial! 🎉

---

### 📦 Cómo creo un contenedor de mi aplicación

En este repo tienes una app de ejemplo en el directorio `app` (una API REST con Node.js y Express). Para contenerizarla, necesitas un archivo `Dockerfile` con las instrucciones para construir la imagen. [Aquí puedes ver el Dockerfile](app/Dockerfile).

Para crear la imagen, navega al directorio `app` y ejecuta:

```bash
docker build -t heroes-api .
```

Luego, crea el contenedor y expón el puerto:

```bash
docker run -p 3000:3000 heroes-api
```

Accede a tu API REST en `http://localhost:3000/heroes`. ¡Tu primera app propia en Docker! 🚀

---

### 🗄️ Un contenedor de una base de datos

Normalmente, tu app necesita una base de datos. Lo ideal es que esté en un contenedor separado. Por ejemplo, para MongoDB:

```bash
docker run -p 27017:27017 mongo
```

Configura tu app para conectar a la base de datos, por ejemplo en el archivo `.env`:

```
MONGO_URI=mongodb://localhost:27017/heroes
```

---

### 💾 Y cómo guardo los datos

Por defecto, los datos de MongoDB se guardan en un volumen temporal (si borras el contenedor, se pierden). Para persistir los datos, usa un volumen:

```bash
docker run -p 27017:27017 -v mongo-data:/data/db mongo
```

Así los datos se guardan en el volumen `mongo-data` y no se pierden. ¡Tus datos a salvo! 🛡️

---

### 🔗 Cómo conecto varios contenedores

Puedes conectar contenedores usando la opción `--link`:

```bash
docker run -p 3000:3000 --link mongo:mongo heroes-api
```

Esto enlaza tu app con MongoDB usando el alias `mongo`. También puedes usar redes personalizadas o Docker Compose para conexiones más avanzadas. ¡Lo veremos en el bootcamp! 💛

---

### 🧩 Docker Compose

Docker Compose te permite definir y ejecutar aplicaciones multi-contenedor con un solo archivo `compose.yml`. [Aquí tienes un ejemplo en este repo](compose.yml). Es ideal para proyectos con varios servicios. 🧩

---

### ✨ Otros usos

Los contenedores no solo sirven para desplegar apps. Mira estos ejemplos:

#### 💻 Dev Containers

Crea entornos de desarrollo reproducibles usando contenedores. Así todo tu equipo trabaja igual, sin "en mi máquina funciona". Puedes usarlos con VS Code o GitHub Codespaces. [Más info aquí](https://code.visualstudio.com/docs/devcontainers/containers).

#### 🤖 IA > Docker Model Runner

Ejecuta modelos de IA en contenedores, aislando recursos y facilitando la portabilidad:

```bash
docker model run --model <model-name> --input <input-data>
```

Ideal para modelos que requieren mucha memoria o recursos. 🧠

#### 🧠 MCP Servers

Los MCP (Model Context Protocol) Servers también pueden ejecutarse en contenedores. Docker Desktop incluye el `MCP Toolkit` para gestionarlos fácilmente. [Más info en la documentación oficial](https://docs.docker.com/desktop/mcp-toolkit/).

---

### 🏁 Conclusión

Docker es una herramienta poderosa para crear, desplegar y ejecutar aplicaciones en contenedores. En este repo tienes ejemplos para apps, bases de datos y otros servicios. Si quieres aprender más sobre Docker y tecnologías DevOps como Kubernetes o Terraform, te recomiendo el [Bootcamp de DevOps de Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio). ¡Nos vemos en el siguiente stream! 🚀💛
